import { IsOptional } from 'class-validator';

export class FindApplicationDto {
  @IsOptional()
  name?: string;
  
  @IsOptional()
  page?: number;

  @IsOptional()
  size?: number;

  @IsOptional()
  project_id?: number;

  @IsOptional()
  status?: number;

  @IsOptional()
  industry_id?: number;
}