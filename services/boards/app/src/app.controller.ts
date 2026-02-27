import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AppService } from './app.service';


@Controller('boards') // Added a prefix for clean routing
export class AppController {
  constructor(private readonly prisma: PrismaService, private readonly appService: AppService) {}

  @Get('health')
  async health() {
    try {
      await this.prisma.activity.count();
      return { status: 'ok', database: 'connected' };
    } catch (e) {
      return { status: 'error', database: 'disconnected' };
    }
  }
    
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

