import { PrismaModule } from './prisma.module';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { TasksGateway } from './tasks/tasks.gateway';

@Module({
  imports: [PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController, TasksController],
  providers: [AppService, TasksService, TasksGateway],
})
export class AppModule {}

