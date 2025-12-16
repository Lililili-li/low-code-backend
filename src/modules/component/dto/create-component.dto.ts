import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateComponentDto {

  @IsNotEmpty({message: '组件ID不能为空'})
  id: string

  @IsNotEmpty({ message: '组件名称不能为空' })
  name: string;

  @IsNotEmpty({ message: '组件封面不能为空' })
  cover: string;

  @IsNotEmpty({ message: '分类ID不能为空' })
  category_id: number;

  @IsOptional()
  @IsBoolean()
  internal?: boolean;
}
