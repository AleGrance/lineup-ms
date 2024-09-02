import { Module } from '@nestjs/common';
import { NavierasService } from './navieras.service';
import { NavierasController } from './navieras.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Navieras } from 'src/models/navieras';

@Module({
  imports: [SequelizeModule.forFeature([Navieras])],
  controllers: [NavierasController],
  providers: [NavierasService],
})
export class NavierasModule {}
