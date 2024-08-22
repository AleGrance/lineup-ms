import { Module } from '@nestjs/common';
import { BarcazasService } from './barcazas.service';
import { BarcazasController } from './barcazas.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Barcazas } from 'src/models/barcazas.model';

@Module({
  imports: [SequelizeModule.forFeature([Barcazas])],
  controllers: [BarcazasController],
  providers: [BarcazasService],
})
export class BarcazasModule {}
