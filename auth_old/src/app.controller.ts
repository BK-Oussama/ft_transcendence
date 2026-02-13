import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('auth') // No prefix here because Nginx handles /api/auth/
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('status')
  async getStatus() {
    try {
      // Try to count users to verify DB connection
      const userCount = await this.prisma.user.count();
      
      return {
        status: 'ok',
        message: 'Auth Service is connected via SSL Bridging!',
        database: 'Connected',
        userCount: userCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: 'error',
        database: 'Disconnected',
        message: 'Auth Service is up, but Database is unreachable.',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}