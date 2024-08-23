import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './modules/productos/productos.module';
import { ProveedoresModule } from './modules/proveedores/proveedores.module';
import { ImportadoresModule } from './modules/importadores/importadores.module';
import { BuquesModule } from './modules/buques/buques.module';
import { BarcazasModule } from './modules/barcazas/barcazas.module';
import { RemolcadoresModule } from './modules/remolcadores/remolcadores.module';
import { BoxesModule } from './modules/boxes/boxes.module';
import { PuertosModule } from './modules/puertos/puertos.module';
import { MovimientosModule } from './modules/movimientos/movimientos.module';
import { ConfigModule } from '@nestjs/config';
// Sequelize
import { SequelizeModule } from '@nestjs/sequelize';
import { Productos } from './models/productos.model';
import { Proveedores } from './models/proveedores.model';
import { Importadores } from './models/importadores.model';
import { Buques } from './models/buques.model';
import { Barcazas } from './models/barcazas.model';
import { Remolcadores } from './models/remolcadores.model';
import { Boxes } from './models/boxes.model';
import { Puertos } from './models/puertos.model';
import { Movimientos } from './models/movimientos.model';
import { UploadController } from './services/upload.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno sean globales
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
      models: [Productos, Proveedores, Importadores, Buques, Barcazas, Remolcadores, Boxes, Puertos, Movimientos],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ProductosModule,
    ProveedoresModule,
    ImportadoresModule,
    BuquesModule,
    BarcazasModule,
    RemolcadoresModule,
    BoxesModule,
    PuertosModule,
    MovimientosModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule {}
