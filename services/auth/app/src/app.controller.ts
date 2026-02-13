import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('status')
  async getStatus() {
    try {
      // Don't call $connect here; just run a count.
      // Prisma handles the connection pool internally.
      const userCount = await this.prisma.user.count();
      return { 
        status: 'ok', 
        message: 'Auth Service is listening on 443!',
        database: 'Connected',
        userCount 
      };
    } catch (error) {
      return { 
        status: 'partial_ok', 
        message: 'API is up, but Database check failed',
        database: 'Error',
        details: error.message // This will tell us WHY it failed
      };
    }
  }
}