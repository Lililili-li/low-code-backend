import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from '../users/users.service';
import { ProjectService } from '../project/project.service';
import { IndustryService } from '../industry/industry.service';

@Module({
  imports: [],
  providers: [ApplicationService, PrismaService, UsersService, ProjectService, IndustryService],
  controllers: [ApplicationController],
  exports: [ApplicationService],
})
export class ApplicationModule { }
