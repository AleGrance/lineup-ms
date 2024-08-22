import { Module } from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { BoxesController } from './boxes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Boxes } from 'src/models/boxes.model';

@Module({
  imports: [SequelizeModule.forFeature([Boxes])],
  controllers: [BoxesController],
  providers: [BoxesService],
})
export class BoxesModule {}
