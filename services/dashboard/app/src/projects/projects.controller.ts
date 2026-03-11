import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('api/projects')
@UseGuards(JwtAuthGuard) 
export class ProjectsController {
    // Inject both the ProjectsService and PrismaService
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly prisma: PrismaService
    ) {}

    /**
     * INFRASTRUCTURE TEST ROUTE
     * URL: GET https://localhost/api/dashboard/status
     */
    @Get('status')
    getStatus() {
        return {
            status: 'OK',
            message: 'Infrastructure handshake successful.',
            container: 'dashboard-service',
            port: 443,
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * DATABASE HEALTH CHECK
     * URL: GET https://localhost/api/dashboard/health
     */
    @Get('health')
    async health() {
        try {
            // Check the 'Project' model from your dashboard schema
            const projectCount = await this.prisma.project.count();
            return { 
                status: 'ok', 
                database: 'connected', 
                model: 'Project',
                totalProjects: projectCount 
            };
        } catch (e) {
            return { 
                status: 'error', 
                database: 'disconnected',
                error: e.message 
            };
        }
    }


  /**
   * ROOT HELLO ROUTE
   * URL: GET https://localhost/api/auth
   */
  @Get()
  getHello(): string {
    return this.projectsService.getHello();
  }

    // --- EXISTING PROJECT LOGIC BELOW ---

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