import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateIndustryDto {

  @IsNotEmpty({message: 'name不能为空'})
  name: string

  @IsOptional()
  description: string

  @IsOptional()
  sort: number

  @IsOptional()
  is_active: boolean
}
