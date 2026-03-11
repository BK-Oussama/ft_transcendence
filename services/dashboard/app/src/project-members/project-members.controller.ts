import { Controller, Get, Post, Param, Body, Put, Delete, Headers, ForbiddenException, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('api/projects/:projectId/members')
@UseGuards(JwtAuthGuard) 
export class ProjectMembersController {
    constructor(private readonly projectMemberService: ProjectMembersService) {}

    @Post()
    @UseGuards(RolesGuard)
    @Roles('OWNER', 'ADMIN') // only owners and admins can add members
    async addMember(
        @Param('projectId', ParseIntPipe) projectId: number, 
        @Body() addMemberDto: AddMemberDto, 
        @CurrentUser() userId: number
    ) {
        return this.projectMemberService.addMember(projectId, addMemberDto);
    }

    @Get()
    findAll(@Param('projectId', ParseIntPipe) projectId: number) {
        return this.projectMemberService.findAll(projectId);
    }

    @Put(':userId')
    @UseGuards(RolesGuard)
    @Roles('OWNER', 'ADMIN') // only owners and admins can update roles
    async updateRole(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Body() updateMemberRoleDto: UpdateMemberRoleDto,
        @CurrentUser() requestingUserId: number
    ) {
        return this.projectMemberService.updateRole(projectId, userId, updateMemberRoleDto);
    }

    @Delete(':userId')
    @UseGuards(RolesGuard)
    @Roles('OWNER') // only owners can remove members
    async remove(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @CurrentUser() requestingUserId: number
    ) {
        return this.projectMemberService.remove(projectId, userId);
    }
}

// add permission check endpoint
@Controller('api/projects/:projectId/permission')
export class ProjectPermissionsController {
    constructor(private readonly projectMemberService: ProjectMembersService) {}

    @Get(':userId')
    checkPermissions(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        return this.projectMemberService.checkPermissions(projectId, userId);
    }
}