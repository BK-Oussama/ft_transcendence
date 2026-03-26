import { ConflictException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProjectMembersService {
    constructor(
        private prisma: PrismaService, 
        private httpService: HttpService,
    ) {}

    // add member to project
    async addMember(projectId: number, addMemberDto: AddMemberDto) {
        // check if project exist
        const project = await this.prisma.project.findUnique({
            where: { id: projectId }
        });

        if (!project)
            throw new NotFoundException(`Project with ID ${projectId} not found`);

        // check if memener already exist
        const existing = await this.prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId: projectId,
                    userId: addMemberDto.userId,
                },
            },
        });

        if (existing) throw new ConflictException('User is already a member of this project');

        return this.prisma.projectMember.create({
            data: {
                projectId: projectId,
                ...addMemberDto,
            },
        });
    }

    // get all members of a project
    async findAll(projectId: number, token: string) {
        const members = await this.prisma.projectMember.findMany({
            where: { projectId },
        });

        const users = await Promise.all(
            members.map(async (member) => {
            try {
                const { data } = await firstValueFrom(
                this.httpService.get<any>(`https://auth/users/${member.userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                );
                return data;
            } catch {
                // fallback if auth service fails
                return {
                id: member.userId,
                name: `User ${member.userId}`,
                email: `user${member.userId}@temp.com`,
                avatar: null,
                };
            }
            })
        );

        return members.map((member) => {
            const user = users.find((u) => u.id === member.userId);
            return {
                userId: member.userId,
                role: member.role,
                joinedAt: member.joinedAt,
                user: user ? {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                avatar: user.avatar || user.avatarUrl || user.avatar_url || null,
                } : null,
            };
        });
    }

    // update member role
    async updateRole(projectId: number, userId: number, updateMemberRoleDto: UpdateMemberRoleDto) {
        // check if member exists
        const member = await this.prisma.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId: projectId,
                    userId: userId,
                },
            },
        });

        if (!member) throw new NotFoundException('Member not found in this project');

        return this.prisma.projectMember.update({
            where: {
                projectId_userId: { projectId: projectId, userId: userId },
            },
            data: updateMemberRoleDto,
        });
    }

    // remove member from Project
    async remove(projectId: number, userId: number) {
        // check for user
        const member = await this.prisma.projectMember.findUnique({
            where: {
                projectId_userId: { projectId: projectId, userId: userId },
            },
        });

        if (!member) throw new NotFoundException('Member not found in this project');

        // check if owner is being removed
        if (member.role === 'OWNER') {
            const ownerCount = await this.prisma.projectMember.count({
                where: {projectId: projectId, role: 'OWNER'},
            });

            if (ownerCount <= 1)
                throw new ForbiddenException('Cannot remove the last owner of the project');   
        }

        return this.prisma.projectMember.delete({
            where: {
                projectId_userId: { projectId: projectId, userId: userId },
            },
        });
    }

    // check user permission in a project
    async checkPermissions(projectId: number, userId: number) {
        const member = await this.prisma.projectMember.findUnique({
            where: { 
                projectId_userId: { projectId: projectId, userId: userId },
            },
        });

        if (!member) return { hasAccess: false, role: null };

        return { hasAccess: true, role: member.role };
    }

    // check if user has required role in a project
    async hasRequiredRole(projectId: number, userId: number, requiredRoles: string[]) {
        const member = await this.prisma.projectMember.findUnique({
            where: {
                projectId_userId: { projectId: projectId, userId: userId },
            },
        });

        if (!member) return false;

        return requiredRoles.includes(member.role);
    }
}
