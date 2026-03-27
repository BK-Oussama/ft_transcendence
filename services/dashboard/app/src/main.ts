import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { PublicApiModule } from './public-api/public-api.module'

async function bootstrap() {

  const httpsOptions = {
    key: fs.readFileSync('./secrets/privkey.pem'),
    cert: fs.readFileSync('./secrets/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  // remove this

  // JUST FOR TESTING THE FRONTEND
  // app.enableCors({
  //   origin: 'http://localhost:5173', // your Vite dev server
  //   credentials: true,
  // });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // for the public api: 
  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Project Service API')
    .setDescription('Public API for managing projects')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', in: 'header', name: 'X-API-Key' },
      'ApiKeyAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
      include: [PublicApiModule],
  });
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 443;
  await app.listen(port);

  console.log(`Prokect Service running on port ${port}`);
}
bootstrap();
