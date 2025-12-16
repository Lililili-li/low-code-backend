import { Module } from '@nestjs/common';
import { DictService } from './dict.service';
import { DictController } from './dict.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DictController],
  providers: [DictService, PrismaService],
})
export class DictModule {}
