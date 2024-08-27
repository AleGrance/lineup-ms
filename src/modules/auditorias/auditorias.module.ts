import { Module } from '@nestjs/common';
import { AuditoriasService } from './auditorias.service';
import { AuditoriasController } from './auditorias.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Auditorias } from 'src/models/auditorias';

@Module({
  imports: [SequelizeModule.forFeature([Auditorias])],
  controllers: [AuditoriasController],
  providers: [AuditoriasService],
  exports: [AuditoriasService]
})
export class AuditoriasModule {}
