import { Controller, Get, Post, Put, Delete, Body, Param, Headers, ForbiddenException, UseGuards, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectMembersService } from 'src/project-members/project-members.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('api/projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() userId: number) {
        return this.projectsService.create(createProjectDto, userId);
    }

    @Get()
    findAll(@CurrentUser() userId: number) {
        return this.projectsService.findAll(userId);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.projectsService.findOne(id);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles('OWNER', 'ADMIN') // only owners and admins can update project
    async update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateProjectDto: UpdateProjectDto, 
        @CurrentUser() userId: number
    ) {
        return this.projectsService.update(id, updateProjectDto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('OWNER') // only owners can delete project  
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.projectsService.remove(id);
    }
}
