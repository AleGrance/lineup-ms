import { Module } from '@nestjs/common';
import { BuquesService } from './buques.service';
import { BuquesController } from './buques.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Buques } from 'src/models/buques.model';

@Module({
  imports: [SequelizeModule.forFeature([Buques])],
  controllers: [BuquesController],
  providers: [BuquesService],
})
export class BuquesModule {}
