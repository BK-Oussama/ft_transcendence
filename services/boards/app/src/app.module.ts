import { PrismaModule } from './prisma.module';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { TasksGateway } from './tasks/tasks.gateway';
import { JwtStrategy } from './auth/jwt.strategy';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    HttpModule
  ],
  controllers: [AppController, TasksController],
  providers: [AppService, TasksService, TasksGateway, JwtStrategy],
})
export class AppModule {}

