import { Module } from '@nestjs/common';
import { ProjectMembersController, ProjectPermissionsController } from './project-members.controller';
import { ProjectMembersService } from './project-members.service';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';

@Module({
  imports: [
    HttpModule.register({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    }),
  ],
  controllers: [
    ProjectMembersController,
    ProjectPermissionsController,
  ],
  providers: [ProjectMembersService],
  exports: [ProjectMembersService],
})
export class ProjectMembersModule {}
