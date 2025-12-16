import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DictService } from './dict.service';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';

@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Post()
  create(@Body() createDictDto: CreateDictDto) {
    return this.dictService.create(createDictDto);
  }

  @Get()
  findAll(@Query('code') code?: string) {
    if (code) {
      return this.dictService.findByCode(code);
    }
    return this.dictService.findAll();
  }

  @Get('grouped')
  findAllGrouped() {
    return this.dictService.findAllGrouped();
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.dictService.findByCode(code);
  }

  @Get('code/:code/key-value')
  getDictByCode(@Param('code') code: string) {
    return this.dictService.getDictByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dictService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDictDto: UpdateDictDto) {
    return this.dictService.update(+id, updateDictDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dictService.remove(+id);
  }
}
