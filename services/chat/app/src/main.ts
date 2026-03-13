import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Added for API Contracts
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/privkey.pem'),
    cert: fs.readFileSync('./secrets/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  // API CONTRACT ENFORCEMENT
  // This ensures only data defined in your DTOs gets through!
  app.enableCors({ origin: 'http://localhost:5173', credentials: true });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  app.enableShutdownHooks();
  await app.listen(443);
  console.log('🚀 Chat Service secure on port 443');
}
bootstrap();


