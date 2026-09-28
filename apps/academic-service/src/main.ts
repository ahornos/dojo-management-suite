import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Configuración de Swagger / OpenAPI
 const config = new DocumentBuilder()
    .setTitle('DMS Academic Service API')
    .setDescription('Academic management microservice for martial arts schools (Dojo Management Suite)')
    .setVersion('1.0')
    .addTag('academic')
    .addTag('students')
    .addApiKey({ type: 'apiKey', name: 'X-School-Id', in: 'header', description: 'School ID for multi-tenant isolation' }, 'X-School-Id')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  //await app.listen(3000);
  await app.listen(3000, '0.0.0.0');
  console.log(`Academic Service running on port 3000. Swagger docs available at /docs`);
}
bootstrap();