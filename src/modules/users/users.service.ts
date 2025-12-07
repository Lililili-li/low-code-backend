import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import type { User } from '../../../generated/prisma/client';
import { Prisma } from '../../../generated/prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

type MakePropertyOptional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P]; };

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(account: string): Promise<MakePropertyOptional<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({ where: { account } });
    if (!user) return null;
    return user;
  }

  async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({ where: userWhereUniqueInput });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({ skip, take, cursor, where, orderBy });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<MakePropertyOptional<User, 'password'>> {
    return this.prisma.user.create({ data });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<MakePropertyOptional<User, 'password'>> {
    const { where, data } = params;
    return this.prisma.user.update({ data, where, omit: { password: true } });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where });
  }

  // Controller compatibility wrappers
  async findAll(): Promise<User[]> {
    return this.users({});
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.user({ id });
    if (!user) throw new HttpException({
      message: '用户不存在',
      code: HttpStatus.UNAUTHORIZED,
    }, HttpStatus.UNAUTHORIZED);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<MakePropertyOptional<User, 'password'>> {
    try {
      const newUser = await this.updateUser({
        where: { id },
        data: updateUserDto as unknown as Prisma.UserUpdateInput,
      });
      return newUser;
    } catch (error) {
      throw new HttpException({
        message: '更新用户失败',
        code: 500,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number): Promise<{ message: string, data: null }> {
    try {
      await this.deleteUser({ id });
      return { message: '删除用户成功', data: null };
    } catch (error) {
      throw new HttpException({
        message: '删除用户失败',
        code: 500,
        stack: error.stack,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }
}