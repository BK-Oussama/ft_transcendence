import { Module } from '@nestjs/common';
import { PublicApiController } from './public-api.controller';
import { ApiKeyGuard }         from './api-key.guard';
import { ProjectsModule }      from 'src/projects/projects.module';

@Module({
  imports: [ProjectsModule],
  controllers: [PublicApiController],
  providers: [ApiKeyGuard],
})
export class PublicApiModule {}