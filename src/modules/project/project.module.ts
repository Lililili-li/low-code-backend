import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService, UsersService],
})
export class ProjectModule {}
