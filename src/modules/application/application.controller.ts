import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { FindApplicationDto } from './dto/find-application.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('application')
@UseGuards(AuthGuard)
export class ApplicationController {
  constructor(private service: ApplicationService) {}

  @Get('')
  findAllApplications(
    @Query() query: FindApplicationDto,
  ) {
    return this.service.findAllApplications(query);
  }

  @Get(':id')
  findApplicationById(@Param('id') id) {
    return this.service.findApplicationById(+id);
  }

  @Post('')
  createApplication(
    @Body() createApplicationDto: CreateApplicationDto,
    @Request() req: Request,
  ) {
    return this.service.createApplication(req['user'].id, createApplicationDto);
  }

  @Put(':id')
  updateApplication(
    @Body() createApplicationDto: UpdateApplicationDto,
    @Param('id') id,
  ) {
    return this.service.updateApplication(+id, createApplicationDto);
  }

  @Delete(':id')
  deleteApplication(@Param('id') id) {
    return this.service.deleteApplication(+id);
  }

  @Get(':id')
  redoApplication(@Param('id') id) {
    return this.service.redoApplication(+id);
  }

  @Post('/invite')
  addDeveloper(@Body() createApplicationDto: UpdateApplicationDto) {}
}
