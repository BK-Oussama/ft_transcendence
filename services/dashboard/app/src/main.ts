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

  // remove this
  // app.setGlobalPrefix('api');

  // JUST FOR TESTING THE FRONTEND
  app.enableCors({
    origin: 'http://localhost:5173', // your Vite dev server
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const port = process.env.PORT || 443;
  await app.listen(port);

  console.log(`Prokect Service running on port ${port}`);
}
bootstrap();
