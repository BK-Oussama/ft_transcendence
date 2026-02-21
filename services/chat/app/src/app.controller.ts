import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('chat') // Added a prefix for clean routing
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async health() {
    try {
      await this.prisma.message.count();
      return { status: 'ok', database: 'connected' };
    } catch (e) {
      return { status: 'error', database: 'disconnected' };
    }
  }
}