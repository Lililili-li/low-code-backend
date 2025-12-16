import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ComponentCategoryService } from './component-category.service';
import { CreateComponentCategoryDto } from './dto/create-component-category.dto';
import { UpdateComponentCategoryDto } from './dto/update-component-category.dto';

@Controller('component-category')
export class ComponentCategoryController {
  constructor(private readonly componentCategoryService: ComponentCategoryService) {}

  @Post()
  create(@Body() createComponentCategoryDto: CreateComponentCategoryDto) {
    return this.componentCategoryService.create(createComponentCategoryDto);
  }

  @Get()
  findAll() {
    return this.componentCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.componentCategoryService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateComponentCategoryDto: UpdateComponentCategoryDto) {
    return this.componentCategoryService.update(+id, updateComponentCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.componentCategoryService.remove(+id);
  }
}
