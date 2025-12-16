import { IsOptional, IsNotEmpty, IsInt } from "class-validator";

export class CreateProjectDto {
  @IsNotEmpty({ message: 'name不能为空' })
  name: string;


  @IsNotEmpty({ message: 'industry_id不能为空' })
  industry_id: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsInt({ message: 'created_by必须为整数' })
  created_by?: number;
  
}
