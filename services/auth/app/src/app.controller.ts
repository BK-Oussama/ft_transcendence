import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService, private readonly appService: AppService) {}

  /**
   * INFRASTRUCTURE TEST ROUTE
   * URL: GET https://localhost/api/auth/status
   * Goal: Prove the Gateway -> NestJS connection is alive without using JWT.
   */


@Get('health')
  async health() {
    try {
      // We use 'user' because Prisma generates the client 
      // based on the model names in your schema.prisma
      const userCount = await this.prisma.user.count();
      
      return { 
        status: 'ok', 
        database: 'connected', 
        schema: 'auth',
        totalUsers: userCount 
      };
    } catch (e) {
      // This will trigger if the DB container is down, 
      // or if the 'auth' schema doesn't exist yet
      return { 
        status: 'error', 
        database: 'disconnected',
        error: e.message 
      };
    }
  }


  @Get('status')
  getStatus() {
    return {
      status: 'OK',
      message: 'Infrastructure handshake successful.',
      container: 'auth-service',
      port: 443,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * ROOT HELLO ROUTE
   * URL: GET https://localhost/api/auth
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
