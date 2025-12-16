import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Project, User } from 'generated/prisma/client';
import { FindProjectDto } from './dto/find-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}
  create(createProjectDto: CreateProjectDto, userId: number): Promise<Project> {
    createProjectDto = {
      ...createProjectDto,
      created_by: userId,
    };
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        industry_id: Number(createProjectDto.industry_id),
      } as unknown as Prisma.ProjectCreateInput,
    });
  }

  async findAll(findProjectDto: FindProjectDto): Promise<{
    list: (Project & { created_user?: User })[];
    total: number;
    page: number;
    size: number;
  }> {
    const page = Math.max(1, Number(findProjectDto.page ?? 1) || 1);
    const size = Math.max(1, Number(findProjectDto.size ?? 10) || 10);
    const skip = (page - 1) * size;

    const where: Prisma.ProjectWhereInput = {
      is_deleted: false,
      ...(findProjectDto.name
        ? { name: { contains: findProjectDto.name } }
        : {}),
    };
    const { count, projects } = await this.prisma.$transaction(async (tx) => {
      const count = await this.prisma.project.count({ where });
      const projects = await this.prisma.project.findMany({
        where,
        skip,
        take: size,
        orderBy: { created_at: 'desc' },
      });

      return { count, projects };
    });
    const list = await Promise.all(
      projects.map(async (item) => {
        const user = await this.usersService.findOne(item.created_by);
        if (!user) throw new Error('created_user not found');
        return { ...item, created_user: user };
      }),
    );

    return {
      list,
      total: count,
      page,
      size,
    };
  }

  async findAllProjects(userId: number) {
    return this.prisma.project.findMany({ where: { created_by: userId } });
  }

  findOne(id: number, userId?: number): Promise<(Project & { created_user?: User }) | null> {
    return this.prisma.project.findUnique({
      where: { id, created_by: userId },
    });
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    const { industry_id, ...rest } = updateProjectDto;
    return this.prisma.project.update({
      where: { id },
      data: {
        ...rest,
        ...(industry_id !== undefined
          ? { industry_id: Number(industry_id) }
          : {}),
      },
    });
  }

  remove(id: number) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
