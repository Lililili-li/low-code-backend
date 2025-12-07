import { Body, Controller, Post } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('application')
export class ApplicationController {

  constructor(private service: ApplicationService) {}

  @Post('/')
  createApplication(@Body() createApplicationDto: CreateApplicationDto) {
    return this.service.createApplication(createApplicationDto);
  }

}
