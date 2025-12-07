import { IsString, IsNotEmpty, MaxLength, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty({ message: '手机号码不能为空' })
  account!: string;
  
  @IsString({ message: 'password必须为字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MaxLength(16)
  password!: string;

  @IsString({ message: 'password必须为字符串' })
  @IsOptional()
  @MaxLength(255)
  avatar?: string;
}