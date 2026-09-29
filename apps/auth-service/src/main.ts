import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * @function bootstrap
 * @description Initializes the NestJS application for the Auth Service, configures global validation pipes,
 * sets up the global API route prefix, integrates Swagger documentation, and starts the HTTP server.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Dojo Management Suite - Auth Service')
    .setDescription('Centralized Authentication and IAM API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.AUTH_SERVICE_PORT || 3000;
  
  await app.listen(port);
  console.log(`Auth Service is running on port ${port}`);
}

bootstrap();