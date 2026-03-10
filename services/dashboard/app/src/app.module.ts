import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { ProjectMembersModule } from './project-members/project-members.module';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    PrismaModule,
    ProjectsModule,
    ProjectMembersModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
