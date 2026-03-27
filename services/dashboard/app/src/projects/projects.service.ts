import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as https from 'https';

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
                        this.httpService.get<any>(`https://auth/users/${ownerMember.userId}`, {
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
            data: {
            ...updateProjectDto,
            dueDate: updateProjectDto.dueDate
                ? new Date(updateProjectDto.dueDate)
                : undefined,
            startDate: updateProjectDto.startDate
                ? new Date(updateProjectDto.startDate)
                : undefined,
            },
        });
    }

    // async remove(projectId: number) {
    //   await this.findOne(projectId);

    //   await firstValueFrom(
    //     this.httpService.delete(`http://boards/tasks/project/${projectId}`)
    //   );

    //     // await firstValueFrom(
    //     //     this.httpService.delete(`https://boards:443/tasks/project/${projectId}`, {
    //     //         httpsAgent: new https.Agent({
    //     //             rejectUnauthorized: false // Necessary for internal self-signed certs
    //     //         })
    //     //     })
    //     // );

    //     return this.prisma.project.delete({
    //       where: { id: projectId },
    //     });
    // }

    async remove(projectId: number) {
      await this.findOne(projectId);

      try {
        await firstValueFrom(
          this.httpService.delete(`https://boards:443/tasks/project/${projectId}`, {
            headers: {
              // This is the "ID card" the Dashboard shows to Boards
              'x-internal-secret': process.env.INTERNAL_SERVICE_SECRET,
            },
            // Allows internal self-signed SSL certificates
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
          }),
        );
      } catch (error) {
        // If the boards service is down, we log it but move on 
        // or throw an error based on your preference
        console.error('Could not clean up tasks:', error.message);
      }

      return this.prisma.project.delete({
        where: { id: projectId },
      });
    }

    async searchUsers(search: string, token: string) {
        const { data } = await firstValueFrom(
            this.httpService.get<any>(`https://auth/users/search?search=${search}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
        );
        return data.map((user: any) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            avatar: user.avatarUrl || null,
        }));
    }


    // for public api
    // avoids calling the auth service (no JWT token available in public context)   
    async findAllPublic() {
        return this.prisma.project.findMany({
            select: {
              id: true,
              title: true,
              description: true,
              status: true,
              startDate: true,
              dueDate: true,
              createdAt: true,
              updatedAt: true,
            },
        });
    }
}
