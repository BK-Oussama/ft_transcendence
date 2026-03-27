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
      // baseURL: 'https://boards:443',
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      // timeout: 5000,
    }),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
