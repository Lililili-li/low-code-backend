import { Controller, Get, Body, Param, Delete, UseGuards, Put, Request, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/shared/auth.guard';

@Controller('/user')

export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req: Request) {
    // 通过 @Headers 装饰器获取 header 中的参数
    // 例如：获取名为 'x-custom-header' 的 header
    // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Headers('x-custom-header') customHeader: string) {
    return this.usersService.update(Number(id), updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
}
