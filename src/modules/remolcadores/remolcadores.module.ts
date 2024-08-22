import { Module } from '@nestjs/common';
import { RemolcadoresService } from './remolcadores.service';
import { RemolcadoresController } from './remolcadores.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Remolcadores } from 'src/models/remolcadores.model';

@Module({
  imports: [SequelizeModule.forFeature([Remolcadores])],
  controllers: [RemolcadoresController],
  providers: [RemolcadoresService],
})
export class RemolcadoresModule {}
