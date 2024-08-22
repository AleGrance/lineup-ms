import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * Usar las validaciones que se describen en los dtos para todos los modulos del proyecto 
   * whitelist: true para evitar que se agreguen campos que no se estan esperando
   */
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  // Se agrega el prefijo api/
  app.setGlobalPrefix('api');

  /**
   * Enable cors
   */
  app.enableCors();

  await app.listen(3002);
}
bootstrap();
