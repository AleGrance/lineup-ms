import { Module } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { EstadosController } from './estados.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Estados } from 'src/models/estados';

@Module({
  imports: [SequelizeModule.forFeature([Estados])],
  controllers: [EstadosController],
  providers: [EstadosService],
})
export class EstadosModule {}
