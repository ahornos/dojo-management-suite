import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * @file main.ts
 * @description Bootstrap function for the financial-service microservice, configuring validation and Swagger documentation.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipes for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global API prefix
  app.setGlobalPrefix('api');

  // Swagger OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle('Dojo Management Suite - Financial Service')
    .setDescription('Financial microservice managing fee tiers, student overrides, mass updates, cash register, and SEPA remittances.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Financial Service is running on: http://localhost:${port}/api`);
  console.log(`Swagger documentation available at: http://localhost:3003/api/docs`);
}

bootstrap();