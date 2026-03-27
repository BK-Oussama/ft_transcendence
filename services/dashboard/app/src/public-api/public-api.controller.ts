import {
  Controller, Get, Post, Put, Delete,
  Param, Body, ParseIntPipe, UseGuards, HttpCode, HttpStatus
} from '@nestjs/common';
import {
  ApiTags, ApiSecurity, ApiOperation,
  ApiResponse, ApiParam, ApiBody
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiKeyGuard }       from './api-key.guard';
import { ProjectsService }   from 'src/projects/projects.service';
import { CreateProjectDto }  from 'src/projects/dto/create-project.dto';
import { UpdateProjectDto }  from 'src/projects/dto/update-project.dto';
import { ForbiddenException } from '@nestjs/common';

@ApiTags('projects')
@ApiSecurity('ApiKeyAuth')
@UseGuards(ApiKeyGuard, ThrottlerGuard)
@Throttle({ default: { limit: 100, ttl: 900_000 } })
@Controller('api/v1')
export class PublicApiController {
  constructor(private readonly projectsService: ProjectsService) {}

  // GET /api/v1/projects
  @Get('projects')
  @ApiOperation({ summary: 'List all projects' })
  @ApiResponse({ status: 200, description: 'Returns all projects' })
  @ApiResponse({ status: 401, description: 'Invalid API key' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  findAll() {
    return this.projectsService.findAllPublic();
  }

  // GET /api/v1/projects/:id
  @Get('projects/:id')
  @ApiOperation({ summary: 'Get a single project' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the project' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  // POST /api/v1/projects
  @Post('projects')
  @ApiOperation({ summary: 'Create a project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ status: 201, description: 'Project created' })
  create(@Body() dto: CreateProjectDto) {
    // system user ID = 0 means created via public API
    return this.projectsService.create(dto, 0);
  }

  
  // @ApiParam({ name: 'id', type: Number })
  // @ApiBody({ type: UpdateProjectDto })

  // PUT /api/v1/projects/:id
  @Put('projects/:id')
  @ApiOperation({ summary: 'Update a project - not availbele via public API' })
  @ApiResponse({ status: 403, description: 'Use the authenthicated API to update projects' }) 
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    // return this.projectsService.update(id, dto);
    throw new ForbiddenException('update is not permitted via public API'); 
  }


  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiOperation({ summary: 'Delete a project' })
  // @ApiParam({ name: 'id', type: Number })
  // @ApiResponse({ status: 204, description: 'Project deleted' })



  // DELETE /api/v1/projects/:id
  @Delete('projects/:id')
  @HttpCode(HttpStatus.FORBIDDEN)
  @ApiOperation({ summary: 'Delete a project - not availbele via public API' })
  @ApiResponse({ status: 403, description: 'Use the authenthicated API to update projects' })
  remove(@Param('id', ParseIntPipe) id: number) {
   // return this.projectsService.remove(id);
    throw new ForbiddenException('delete is not permitted via public API');
  }
}