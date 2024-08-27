import { Module } from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { MovimientosController } from './movimientos.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Movimientos } from 'src/models/movimientos.model';
import { AuditoriasModule } from '../auditorias/auditorias.module';

@Module({
  imports: [SequelizeModule.forFeature([Movimientos]), AuditoriasModule],
  controllers: [MovimientosController],
  providers: [MovimientosService],
})
export class MovimientosModule {}
