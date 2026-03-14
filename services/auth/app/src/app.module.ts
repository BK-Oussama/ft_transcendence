import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
<<<<<<< Updated upstream
  imports: [PrismaModule, AuthModule, ConfigModule.forRoot({ isGlobal: true })] ,
=======
  imports: [PrismaModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), UsersModule],
>>>>>>> Stashed changes
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
