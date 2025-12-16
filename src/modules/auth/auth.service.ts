import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { hashPasswordArgon2, verifyPasswordArgon2 } from 'src/shared/utils';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn({ account, password }: CreateUserDto): Promise<any> {
    const user = await this.usersService.findByUsername(account);
    if (!user) throw new HttpException({
      code: 400,
      message: '用户名或密码错误',
    }, HttpStatus.BAD_REQUEST);
    const passwordValid = await verifyPasswordArgon2(password, user.password!);
    if (!passwordValid) throw new HttpException({
      code: 400,
      message: '用户名或密码错误',
    }, HttpStatus.BAD_REQUEST);
    const payload = { id: user.id, account: user.account };
    delete user.password
    return {
      message: '登录成功',
      code: 200,
      data: { ...user, access_token: await this.jwtService.signAsync(payload) }
    };
  }

  async register({ account, password, user_name, avatar }: CreateUserDto): Promise<any> {
    const user = await this.usersService.findByUsername(account);
    if (user) throw new HttpException({
      code: 400,
      message: '用户名已存在',
    }, HttpStatus.BAD_REQUEST);
    const hash = await hashPasswordArgon2(password);
    const newUser = await this.usersService.createUser({
      account,
      password: hash,
      user_name: user_name || '默认用户',
      avatar: avatar || null,
    });
    delete newUser.password;
    return {
      message: '注册成功',
      code: 200,
      data: newUser
    };
  }
}