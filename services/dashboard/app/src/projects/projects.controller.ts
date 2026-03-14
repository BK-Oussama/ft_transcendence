import { Controller, Get, Post, Headers, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';


@Controller() // REMOVE 'dashboard' so it catches root paths after Nginx stripping
export class InfrastructureController {
    @Get('status')
    getStatus() { return { status: 'OK' }; }

    @Get('health')
    async health() { return { database: 'ok' }; }
}


@Controller('projects')
@UseGuards(JwtAuthGuard) 
export class ProjectsController {
    // Inject both the ProjectsService and PrismaService
    // NOTE: you should not injectt prismaService here (i only inject it in the service)
    constructor(
        private readonly projectsService: ProjectsService) {}

    @Post()
    create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() userId: number) {
        return this.projectsService.create(createProjectDto, userId);
    }

    @Get()
    findAll(
        @CurrentUser() userId: number,
        @Headers('authorization') authorization: string,
    ) {
        const token = authorization?.replace('Bearer ', '');
        return this.projectsService.findAll(userId, token);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.projectsService.findOne(id);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles('OWNER', 'ADMIN')
    async update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateProjectDto: UpdateProjectDto, 
        @CurrentUser() userId: number
    ) {
        return this.projectsService.update(id, updateProjectDto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('OWNER')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.projectsService.remove(id);
    }
}