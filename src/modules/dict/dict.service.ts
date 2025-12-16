import { Injectable } from '@nestjs/common';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { PrismaService } from 'src/prisma.service';
import { Dict, Prisma } from 'generated/prisma/client';

@Injectable()
export class DictService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建字典项
   */
  async create(createDictDto: CreateDictDto): Promise<Dict> {
    return await this.prisma.dict.create({
      data: {
        code: createDictDto.code,
        value: createDictDto.value,
        label: createDictDto.label,
        sort: createDictDto.sort ?? 0,
        description: createDictDto.description,
        is_active: createDictDto.is_active ?? true,
      },
    });
  }

  /**
   * 查询所有字典项（支持按 code 筛选）
   */
  async findAll(code?: string): Promise<Dict[]> {
    const where: Prisma.DictWhereInput = {
      ...(code ? { code } : {}),
    };
    return await this.prisma.dict.findMany({
      where,
      orderBy: [{ code: 'asc' }, { sort: 'asc' }, { created_at: 'desc' }],
    });
  }

  /**
   * 根据 code 查询字典项（按 code 分组返回）
   */
  async findByCode(code: string): Promise<Dict[]> {
    return await this.prisma.dict.findMany({
      where: {
        code,
        is_active: true,
      },
      orderBy: [{ sort: 'asc' }, { created_at: 'desc' }],
    });
  }

  /**
   * 根据 code 查询字典项并返回键值对格式
   */
  async getDictByCode(code: string): Promise<Record<string, string>> {
    const dicts = await this.findByCode(code);
    return dicts.reduce((acc, item) => {
      acc[item.value] = item.label;
      return acc;
    }, {} as Record<string, string>);
  }

  /**
   * 查询所有字典（按 code 分组）
   */
  async findAllGrouped(): Promise<Record<string, Dict[]>> {
    const dicts = await this.findAll();
    return dicts.reduce((acc, item) => {
      if (!acc[item.code]) {
        acc[item.code] = [];
      }
      acc[item.code].push(item);
      return acc;
    }, {} as Record<string, Dict[]>);
  }

  /**
   * 根据 id 查询单个字典项
   */
  async findOne(id: number): Promise<Dict | null> {
    return await this.prisma.dict.findUnique({
      where: { id },
    });
  }

  /**
   * 更新字典项
   */
  async update(id: number, updateDictDto: UpdateDictDto): Promise<Dict> {
    return await this.prisma.dict.update({
      where: { id },
      data: updateDictDto,
    });
  }

  /**
   * 删除字典项
   */
  async remove(id: number): Promise<Dict> {
    return await this.prisma.dict.delete({
      where: { id },
    });
  }
}
