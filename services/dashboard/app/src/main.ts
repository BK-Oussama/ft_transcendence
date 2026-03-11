import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {

  const httpsOptions = {
    key: fs.readFileSync('./secrets/privkey.pem'),
    cert: fs.readFileSync('./secrets/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.setGlobalPrefix('api');

  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.enableCors();

  const port = process.env.PORT || 443;
  await app.listen(port);

  console.log(`Prokect Service running on port ${port}`);
}
bootstrap();
