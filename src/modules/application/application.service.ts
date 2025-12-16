import { ProjectService } from './../project/project.service';
import { Injectable } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { FindApplicationDto } from './dto/find-application.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UsersService } from '../users/users.service';
import { IndustryService } from '../industry/industry.service';
@Injectable()
export class ApplicationService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private projectService: ProjectService,
    private industryService: IndustryService
  ) {}

  async createApplication(userId: number, params: CreateApplicationDto) {
    const project = await this.projectService.findOne(params.project_id!);
    if (!project) {
      throw new Error('project not found for updateApplication');
    }
    const application = await this.prisma.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: {
          ...params,
          created_by: userId,
          cover:
            params.cover ||
            'http://flyfish-demo.cloudwise.com/minio/lcap/lcapWeb/www/application_tpl/cover.jpeg',
          industry_id: project.industry_id,
        },
      });
      await tx.applicationUserRelation.create({
        data: { application_id: application.id, user_id: userId },
      });
      return application;
    });
    return application;
  }

  async findAllApplications(findApplicationDto: FindApplicationDto) {
    const page = Math.max(1, Number(findApplicationDto.page ?? 1) || 1);
    const size = Math.max(1, Number(findApplicationDto.size ?? 10) || 10);
    const skip = (page - 1) * size;

    const where: Prisma.ApplicationWhereInput = {
      is_deleted: false,
      ...(findApplicationDto.name
        ? { name: { contains: findApplicationDto.name } }
        : {}),
      ...(findApplicationDto.industry_id
        ? { industry_id: Number(findApplicationDto.industry_id) }
        : {}),
      ...(findApplicationDto.status
        ? { status: Number(findApplicationDto.status) }
        : {}),
      ...(findApplicationDto.project_id
        ? { project_id: Number(findApplicationDto.project_id) }
        : {}),
    };
    const { count, applications } = await this.prisma.$transaction(
      async (tx) => {
        const count = await this.prisma.application.count({ where });
        const applications = await this.prisma.application.findMany({
          where,
          skip,
          take: size,
          orderBy: { created_at: 'desc' },
        });
        return { count, applications };
      },
    );
    const list = await Promise.all(
      applications.map(async (item) => {
        const user = await this.usersService.findOne(item.created_by);
        const project = await this.projectService.findOne(
          item.project_id,
          item.created_by,
        );
        const industry = await this.industryService.findOne(item.industry_id!)
        if (!user) throw new Error('created_user not found');
        return { ...item, created_user: user, project, industry };
      }),
    );
    return {
      list: list,
      total: count,
      page,
      size,
    };
  }

  async findApplicationById(applicationId: number) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });
    return application;
  }

  async updateApplication(applicationId: number, params: UpdateApplicationDto) {
    const project = await this.projectService.findOne(params.project_id!);
    if (!project) {
      throw new Error('project not found for updateApplication');
    }
    return await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        ...params,
        industry_id:  project.industry_id,
      },
    });
  }

  async deleteApplication(applicationId: number) {
    await this.prisma.application.update({
      where: { id: applicationId },
      data: { is_deleted: true, deleted_at: new Date() },
    });
    return null;
  }

  async redoApplication(applicationId: number) {
    await this.prisma.application.update({
      where: { id: applicationId },
      data: { is_deleted: false, deleted_at: null },
    });
    return null;
  }

  // TODO 添加协作成员
  async addDeveloper(memberId: number, applicationId: number) {
    await this.prisma.applicationUserRelation.create({
      data: {
        application_id: applicationId,
        user_id: memberId,
      },
    });
  }

  async removeDeveloper(applicationId: number, memberId: number) {
    await this.prisma.applicationUserRelation.deleteMany({
      where: { application_id: applicationId, user_id: memberId },
    });
  }
}
