import { Injectable } from '@nestjs/common';
import { Components } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';

@Injectable()
export class ComponentService {
  constructor(private prisma: PrismaService) {}

  async create(createComponentDto: CreateComponentDto): Promise<Components> {
    return this.prisma.components.create({
      data: createComponentDto,
    });
  }

  async findAll(): Promise<Components[]> {
    return this.prisma.components.findMany();
  }

  async findAllByCategory(id: number): Promise<Components[]> {
    return this.prisma.components.findMany({
      where: {category_id: id}
    });
  }


  async findOne(id: string): Promise<Components | null> {
    return this.prisma.components.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateComponentDto: UpdateComponentDto): Promise<Components> {
    return this.prisma.components.update({
      where: { id },
      data: updateComponentDto,
    });
  }

  async remove(id: string): Promise<Components> {
    return this.prisma.components.delete({
      where: { id },
    });
  }
}
