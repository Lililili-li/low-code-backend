import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';

@Module({
  imports: [],
  providers: [ApplicationService],
  controllers: [ApplicationController],
   exports: [ApplicationService],
})
export class ApplicationModule { }
