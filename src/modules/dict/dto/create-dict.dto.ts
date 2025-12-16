import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateDictDto {
  @IsNotEmpty({ message: 'code不能为空' })
  @IsString()
  code: string; // 字典编码（字段名）

  @IsNotEmpty({ message: 'value不能为空' })
  @IsString()
  value: string; // 枚举值

  @IsNotEmpty({ message: 'label不能为空' })
  @IsString()
  label: string; // 枚举值对应的标签

  @IsOptional()
  @IsNumber()
  sort?: number; // 排序

  @IsOptional()
  @IsString()
  description?: string; // 描述

  @IsOptional()
  @IsBoolean()
  is_active?: boolean; // 是否启用
}
