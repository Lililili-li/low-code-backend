import { Injectable } from '@nestjs/common';
import { CreateComponentCategoryDto } from './dto/create-component-category.dto';
import { UpdateComponentCategoryDto } from './dto/update-component-category.dto';
import { PrismaService } from 'src/prisma.service';
import { ComponentsCategory } from 'generated/prisma/client';

@Injectable()
export class ComponentCategoryService {
  constructor(private prisma: PrismaService) {}
  create(
    createComponentCategoryDto: CreateComponentCategoryDto,
  ): Promise<ComponentsCategory> {
    return this.prisma.componentsCategory.create({
      data: createComponentCategoryDto,
    });
  }

  async findAll() {
    const categories = await this.prisma.componentsCategory.findMany()
    const result: (ComponentsCategory & { children?: ComponentsCategory[] })[] = []
    
    // 第一步：将所有节点存入 map，以 id 为 key，并初始化 children 数组
    categories.forEach(category => {
      if (!category.parent_id) {
        category['children'] = []
        result.push(category)
      }
    })
    
    // 第二步：遍历所有节点，通过 parent_id 构建父子关系
    categories.forEach(category => {
      // parent_id 为 null 或 0 表示根节点
      if (category.parent_id && category.parent_id !== 0) {
        // 如果有父节点，将其添加到父节点的 children 中
        const parent = result.find(item => item.id === category.parent_id)
        if (parent) {
          parent.children!.push(category)
        }
      }
    })
    return result;
  }

  findOne(id: number) {
    return this.prisma.componentsCategory.findUnique({where: {id}});
  }

  update(id: number, updateComponentCategoryDto: UpdateComponentCategoryDto) {
    return this.prisma.componentsCategory.update({
      where: {id},
      data: updateComponentCategoryDto
    });
  }

  remove(id: number) {
    return this.prisma.componentsCategory.delete({where: {id}});
  }
}
