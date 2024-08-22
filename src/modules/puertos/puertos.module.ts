import { Module } from '@nestjs/common';
import { PuertosService } from './puertos.service';
import { PuertosController } from './puertos.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Puertos } from 'src/models/puertos.model';

@Module({
  imports: [SequelizeModule.forFeature([Puertos])],
  controllers: [PuertosController],
  providers: [PuertosService],
})
export class PuertosModule {}
