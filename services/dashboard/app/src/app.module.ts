import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { ProjectMembersModule } from './project-members/project-members.module';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { InfrastructureController } from './projects/projects.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { PublicApiModule } from './public-api/public-api.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 900_000, limit: 100 }]),
    PublicApiModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    PrismaModule,
    ProjectsModule,
    ProjectMembersModule,
  ],
  controllers: [InfrastructureController],
  providers: [JwtStrategy],
})
export class AppModule {}
