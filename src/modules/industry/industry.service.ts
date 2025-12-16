import { Injectable, UseGuards } from '@nestjs/common';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { PrismaService } from 'src/prisma.service';
import { Industry } from 'generated/prisma/client';

@Injectable()
export class IndustryService {
  constructor(private prisma: PrismaService) {}

  async create(createIndustryDto: CreateIndustryDto): Promise<Industry> {
    return await this.prisma.industry.create({
      data: createIndustryDto,
    });
  }

  async findAll(): Promise<Industry[]> {
    return await this.prisma.industry.findMany({
      orderBy: { sort: 'desc' },
    });
  }

  async findOne(id: number): Promise<Industry | null> {
    return await this.prisma.industry.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateIndustryDto: UpdateIndustryDto): Promise<Industry> {
    return await this.prisma.industry.update({
      where: { id },
      data: updateIndustryDto,
    });
  }

  async remove(id: number): Promise<Industry> {
    return await this.prisma.industry.delete({
      where: { id },
    });
  }
}
