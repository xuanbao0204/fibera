import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

import helmet from "helmet";
import cookieParser from "cookie-parser";
import { HttpStatus, ValidationPipe, VersioningType } from '@nestjs/common';
import { ApiException } from './common/exceptions/api.exception.js';
import { ErrorCode } from './common/constants/error-code.enum.js';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  const config = app.get(ConfigService);

  app.use(helmet());
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Fibera API')
    .setDescription('API documentation for Fibera')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document, { useGlobalPrefix: true,});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) =>
        new ApiException(
          HttpStatus.BAD_REQUEST,
          ErrorCode.VALIDATION_ERROR,
          'Validation failed',
          errors.flatMap((error) =>
            Object.keys(error.constraints ?? {}).map((constraint) => ({
              field: error.property,
              reason: constraint,
            })),
          ),
        ),
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>('CLIENT_URL'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  const port = process.env.PORT ?? 3000;

  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
await bootstrap();
