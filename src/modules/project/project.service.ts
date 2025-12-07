import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Project } from 'generated/prisma/client';
import { FindProjectDto } from './dto/find-project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  create(createProjectDto: CreateProjectDto, userId: number): Promise<Project> {
    createProjectDto = {...createProjectDto, created_by: userId}
    return this.prisma.project.create({data: createProjectDto as unknown as Prisma.ProjectCreateInput})
  }

  async findAll(
    userId: number,
    findProjectDto: FindProjectDto,
  ): Promise<{
    list: (Project & { created_user: string | null })[];
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

    const [user, total, projects] = await this.prisma.$transaction([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where,
        skip,
        take: size,
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return {
      list: projects.map((project) => ({
        ...project,
        created_user: user?.user_name ?? null,
      })),
      total,
      page,
      size,
    };
  }

  findOne(id: number, userId: number) {
    return this.prisma.project.findUnique({where: {id, created_by: userId}});
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({where: {id}, data: updateProjectDto});
  }

  remove(id: number) {
    return this.prisma.project.delete({
      where: {id}
    });;
  }
}
