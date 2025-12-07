import { IsOptional } from "class-validator";

export class FindProjectDto {
  @IsOptional()
  page?: number;

  @IsOptional()
  size?: number;

  @IsOptional()
  name?: string;
}
