import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // 0. Ensure uploads directory exists
  const uploadDir = './uploads/avatars';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📁 Created uploads directory');
  }

  // 1. SSL Setup (Required for our Internal HTTPS)
  const httpsOptions = {
    key: fs.readFileSync('./secrets/privkey.pem'),
    cert: fs.readFileSync('./secrets/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  // 2. Auth Logic: CORS 
  // Note: Since we use an API Gateway, Nginx usually handles CORS. 
  // However, keeping this ensures the service is protected if hit directly.
  
  // comment just for testing
  // app.enableCors({
  //   origin: true, // Allows the Gateway to communicate
  //   credentials: true,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  // });



  // 3. Auth Logic: Cookies (Required for JWT storage)
  app.use(cookieParser());

  // 4. API Contract & Data Transformation
  // 'transform: true' is vital for Auth DTOs to convert plain objects to class instances
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  app.enableShutdownHooks();

  // 5. Port 443 (Required for our Docker Containerization)
  await app.listen(443);
  console.log('🚀 Authentication Service secure on port 443');
}
bootstrap();