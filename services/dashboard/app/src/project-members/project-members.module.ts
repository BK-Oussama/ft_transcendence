import { Module } from '@nestjs/common';
import { ProjectMembersController, ProjectPermissionsController } from './project-members.controller';
import { ProjectMembersService } from './project-members.service';

@Module({
  controllers: [
    ProjectMembersController,
    ProjectPermissionsController,
  ],
  providers: [ProjectMembersService],
  exports: [ProjectMembersService],
})
export class ProjectMembersModule {}
