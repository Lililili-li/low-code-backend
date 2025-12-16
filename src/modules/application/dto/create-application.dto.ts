import { IsString, IsNotEmpty, MaxLength, IsOptional, IsPhoneNumber, IsInt } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty({ message: '应用名称不能为空' })
  name: string;

  @IsOptional()
  @IsString({ message: '行业必须为字符串' })
  industry_id?: string;

  @IsNotEmpty({ message: '项目名称不能为空' })
  @IsInt({ message: '项目ID必须为整数' })
  project_id: number;

  @IsOptional()
  @IsString({ message: '应用描述必须为字符串' })
  description?: string;

  @IsOptional()
  @IsString({ message: '应用封面图片必须为字符串' })
  cover?: string;


  @IsOptional()
  @IsInt({ message: '状态必须为整数' })
  status: number;
}