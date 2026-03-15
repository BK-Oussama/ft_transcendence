import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { ChatService } from './chat.service';
import { AppController } from './app.controller';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // Ensure this is here
import { JwtStrategy } from './auth/jwt.strategy'; 

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register Passport
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [
    ChatService, 
    ChatGateway, 
    JwtStrategy, // 👈 CRITICAL: If this is missing, you get a 500 error
  ],
})
export class AppModule {}