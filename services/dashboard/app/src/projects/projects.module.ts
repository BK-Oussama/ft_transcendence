import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectMembersService } from 'src/project-members/project-members.service';
import { ProjectMembersModule } from 'src/project-members/project-members.module';

import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [ProjectMembersModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService],
})
export class ProjectsModule {}
