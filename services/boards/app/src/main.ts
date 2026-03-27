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

  // app.setGlobalPrefix('api');

  // API CONTRACT ENFORCEMENT
  // This ensures only data defined in your DTOs gets through!
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // remove this after testing
  // app.enableCors({
  //   origin: 'http://localhost:5173',
  //   credentials: true,
  // });

  app.enableShutdownHooks();
  // app.enableCors(); uncomment this when im finished with my task page
  await app.listen(process.env.PORT ?? 443);
  console.log('🚀 Dashboard Service secure on port 443');
}
bootstrap();
