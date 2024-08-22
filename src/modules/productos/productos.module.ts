import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Productos } from 'src/models/productos.model';

@Module({
  imports: [SequelizeModule.forFeature([Productos])],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
