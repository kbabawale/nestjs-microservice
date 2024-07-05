import { NestFactory } from '@nestjs/core';
import { UtilityModule } from './utility.module';
import {
  NotAcceptableException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../../libs/common/src/util/http-response.interceptor';
// import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(UtilityModule);
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
    .setTitle('Utility Module')
    .setDescription('Endpoints for all platforms (mobile & web portal)')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalInterceptors(new ResponseInterceptor());
  // fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));

  await app.listen(configService.get('PORT'));
}
bootstrap();
