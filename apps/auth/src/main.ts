import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import {
  NotAcceptableException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../../libs/common/src/util/http-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.use(function (req, res, next) {
    res.header('x-powered-by', 'Technology');
    next();
  });
  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new NotAcceptableException(
          validationErrors[0].constraints,
          'Validation Error',
        );
      },
    }),
  );
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Authentication & User Module')
    .setDescription('Endpoints for all platforms (mobile & web portal)')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(configService.get('PORT'));
}
bootstrap();
