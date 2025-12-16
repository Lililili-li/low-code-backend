import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateComponentCategoryDto {

  @IsNotEmpty({message: "分类名称是必须的"})
  name: string


  @IsNotEmpty({message: "分类图标是必须的"})
  @IsOptional()
  icon?: string

  @IsOptional()
  parent_id?: number

}
