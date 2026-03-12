import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectMembersService } from 'src/project-members/project-members.service';
import { ProjectMembersModule } from 'src/project-members/project-members.module';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    ProjectMembersModule,
    HttpModule.register({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    }),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService],
})
export class ProjectsModule {}
