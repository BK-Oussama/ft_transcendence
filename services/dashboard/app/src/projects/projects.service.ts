import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) {}

    // create a new project
    async create(createProjectDto: CreateProjectDto, creatorUserId: number) {
        
        // create project and add creator as owner in a transaction
        return this.prisma.$transaction(async (tx) => {
            const project = await tx.project.create({
                data: createProjectDto,
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

    // get all projects
    async findAll() {
        return this.prisma.project.findMany({
            include: { members: true },
        });
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
