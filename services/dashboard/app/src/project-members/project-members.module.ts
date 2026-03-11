import { Module } from '@nestjs/common';
import { ProjectMembersController, ProjectPermissionsController } from './project-members.controller';
import { ProjectMembersService } from './project-members.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [
    ProjectMembersController,
    ProjectPermissionsController,
  ],
  providers: [ProjectMembersService],
  exports: [ProjectMembersService],
})
export class ProjectMembersModule {}
