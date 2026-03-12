import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class ProjectsService {
    constructor(
        private prisma: PrismaService,
        private  httpService: HttpService, 
    ) { }

    getHello(): string {
        return 'Hello World!';
    }

    async health() {
        try {
            const projectCount = await this.prisma.project.count();
            return {
                status: 'ok',
                database: 'connected',
                model: 'Project',
                totalProjects: projectCount,
            };
        } catch (e) {
            return {
                status: 'error',
                database: 'disconnected',
                error: e.message,
            };
        }
    }

    // create a new project
    async create(createProjectDto: CreateProjectDto, creatorUserId: number) {

        // create project and add creator as owner in a transaction
        return this.prisma.$transaction(async (tx) => {
            const project = await tx.project.create({
                data: {
                    ...createProjectDto,
                    dueDate: createProjectDto.dueDate 
                        ? new Date(createProjectDto.dueDate) 
                        : undefined,
                    startDate: createProjectDto.startDate 
                        ? new Date(createProjectDto.startDate) 
                        : undefined,
                },
            });

            await tx.projectMember.create({
                data: {
                    projectId: project.id,
                    userId: creatorUserId,
                    role: 'OWNER',
                },
            });

            return project;
        });
    }

    async findAll(userId: number, token: string) {
        // return this.prisma.project.findMany({
        //     where: {
        //        members: { some: { userId } }
        //     },
        //     include: { members: true },
        // });

        const projects = await this.prisma.project.findMany({
            where: { 
                members: { some: { userId } } 
            },
            include: { 
                members: true 
            },
        });

        const projectsWithOwner =  await Promise.all(
            projects.map(async (project) => {
                const ownerMember = project.members.find(m => m.role === 'OWNER');

                if (!ownerMember) return { ...project, owner: null };

                try {
                    const { data: ownerData } = await firstValueFrom(
                        this.httpService.get<any>(`https://auth/api/auth/users/${ownerMember.userId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        })
                    );
                    
                    return {
                        ...project,
                        owner: {
                            id: ownerData.id,
                            name: `${ownerData.firstName} ${ownerData.lastName}`,
                            email: ownerData.email,
                            avatar: ownerData.avatar || null,
                        },
                    };
                } catch {
                    return { ...project, owner: null };
                }

            })
        );
        
        return projectsWithOwner;
    }

    // get project by ID
    async findOne(projectId: number) {

        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { members: true },
        });

        if (!project) throw new NotFoundException(`Project with ID ${projectId} not found`);
        return project;
    }

    // update project
    async update(projectId: number, updateProjectDto: UpdateProjectDto) {
        // check if project exists
        await this.findOne(projectId);

        return this.prisma.project.update({
            where: { id: projectId },
            data: updateProjectDto,
        });
    }

    // delete project
    async remove(projectId: number) {
        // check is exists
        await this.findOne(projectId);

        return this.prisma.project.delete({
            where: { id: projectId },
        });
    }
}
