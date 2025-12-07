import { Controller, Get, Post, Body, Param, Delete, Put, Request, UseGuards, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { FindProjectDto } from './dto/find-project.dto';

@Controller('project')
@UseGuards(AuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req: Request) {
    return this.projectService.create(createProjectDto, req['user'].id);
  }

  @Get()
  findAll(@Request() req: Request, @Query() query: FindProjectDto) {
    return this.projectService.findAll(req['user'].id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: Request) {
    return this.projectService.findOne(+id, req['user']?.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Request() req: Request) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
