import { ResponseInterceptor } from '../../../libs/common/src/util/http-response.interceptor';
import {
  NotAcceptableException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DeliveryModule } from './delivery.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(DeliveryModule);
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
    .setTitle('Storedash Delivery Microservice')
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
