import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  ////VALIDAR DATOS ANTES Q LLEGUEN AL CONTROLLER
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, ////ignora los campos que no sean definidos en el dto
      forbidNonWhitelisted: true, ////LANZA ERROR SI NO SE CUMPLE CON LAS VALIDACIONES
    }),
  );

  // serualizacion (Exclude y @Expose etc toplain())
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  ///versioning
  app.setGlobalPrefix('api/v1');

  ////swagger
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('APIDESCRIP')
    .setVersion('1.0')
    .addTag('API TAG')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  //////cors
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
