import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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
  // app.enableCors();
  
  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Reemplaza esto con la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'apikey'],
    credentials: true,
  });

  await app.listen(3002);
}
bootstrap();
