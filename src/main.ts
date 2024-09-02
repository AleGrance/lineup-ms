import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const logger = new Logger('MS-003 Lineup');

  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT;

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  /**
   * Usar las validaciones que se describen en los dtos para todos los modulos del proyecto
   * whitelist: true para evitar que se agreguen campos que no se estan esperando
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Se agrega el prefijo api/
  app.setGlobalPrefix('api');

  /**
   * Enable cors
   */
  // app.enableCors();

  // Habilitar CORS
  app.enableCors({
    // origin: 'http://10.10.110.2:5000', // Reemplaza esto con la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', 'apikey'],
    credentials: true,
  });

  await app.listen(port);

  logger.log(`Server listen on port ${port}`);
}
bootstrap();
