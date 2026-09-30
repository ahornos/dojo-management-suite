import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * @file main.ts
 * @description Bootstrap function for the academic-service microservice, configuring global validation, API prefix, and Swagger documentation.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipes for DTOs with strict properties filtering
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global API prefix configuration
  app.setGlobalPrefix('api');

  // Swagger OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle('Dojo Management Suite - Academic Service')
    .setDescription('Academic management microservice for martial arts schools (Dojo Management Suite)')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-School-Id',
        in: 'header',
        description: 'School ID for multi-tenant isolation',
      },
      'X-School-Id',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Academic Service is running on: http://localhost:${port}/api`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();