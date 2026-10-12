import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { DEFAULT_PORT, readNumber, resolveAllowedOrigins } from './config/gateway.config';

/**
 * @file main.ts
 * @description Bootstrap function for the API Gateway. Configures security perimeters
 * (CORS, Helmet), global validation, exception handling, and OpenAPI (Swagger) documentation.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet());

  app.enableCors({
    origin: resolveAllowedOrigins(configService),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-School-Id'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Error handling: register the global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('DMS - API Gateway')
    .setDescription('Unified central entry point and reverse proxy for the Dojo Management Suite')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      { 
        type: 'apiKey', 
        name: 'X-School-Id', 
        in: 'header', 
        description: 'Tenant isolation key for multi-dojo environments' 
      }, 
      'X-School-Id'
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = readNumber(configService, 'PORT', DEFAULT_PORT);
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 API Gateway is running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();