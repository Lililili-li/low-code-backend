import { IsOptional, IsNotEmpty, IsInt } from "class-validator";

export class CreateProjectDto {
  @IsNotEmpty({ message: '项目名称不能为空' })
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsInt({ message: '创建人必须为整数' })
  created_by?: number;
}
