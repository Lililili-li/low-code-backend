import { Module } from '@nestjs/common';
import { ComponentCategoryService } from './component-category.service';
import { ComponentCategoryController } from './component-category.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ComponentCategoryController],
  providers: [ComponentCategoryService, PrismaService],
})
export class ComponentCategoryModule {}
