import { Module } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { MovimientosController } from './movimientos.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Movimientos } from 'src/models/movimientos.model';

@Module({
  imports: [SequelizeModule.forFeature([Movimientos])],
  controllers: [MovimientosController],
  providers: [MovimientosService],
})
export class MovimientosModule {}
