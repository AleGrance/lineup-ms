import { Module } from '@nestjs/common';
import { ImportadoresService } from './importadores.service';
import { ImportadoresController } from './importadores.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Importadores } from 'src/models/importadores.model';

@Module({
  imports: [SequelizeModule.forFeature([Importadores])],
  controllers: [ImportadoresController],
  providers: [ImportadoresService],
})
export class ImportadoresModule {}
