import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProjectMembersService } from 'src/project-members/project-members.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private projectMemberService: ProjectMembersService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // get required roles from the route handler
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // if no roles are required, allow access
        if (!requiredRoles) 
            return true;

        const request = context.switchToHttp().getRequest();
        // const userId = Number(request.headers['user-id']);
        const userId = request.user?.id;
        const projectId = Number(request.params['id']) || Number(request.params['projectId']);

        if (!userId || isNaN(userId))
            throw new ForbiddenException('User ID not Provided or Invalid');

        if (!projectId || isNaN(projectId))
            throw new ForbiddenException('Project ID not Provided or Invalid');

        // check if user has required role
        const hasRole = await this.projectMemberService.hasRequiredRole(projectId, userId, requiredRoles);
        
        if (!hasRole)
            throw new ForbiddenException(`Only ${requiredRoles.join(' and ')}s can perform this action`);

        return true;
    }
}

