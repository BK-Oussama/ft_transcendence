import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectMembersService } from 'src/project-members/project-members.service';
import { ProjectMembersModule } from 'src/project-members/project-members.module';

@Module({
  imports: [ProjectMembersModule],
  controllers: [ProjectsController],
  providers: [ProjectsService]
})
export class ProjectsModule {}
