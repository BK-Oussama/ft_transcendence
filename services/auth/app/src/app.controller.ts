import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('auth') // Matches your Gateway pathing (/api/auth/...)
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * INFRASTRUCTURE TEST ROUTE
   * URL: GET https://localhost/api/auth/status
   * Goal: Prove the Gateway -> NestJS connection is alive without using JWT.
   */
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