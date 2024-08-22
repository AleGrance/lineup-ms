import { Module } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresController } from './proveedores.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Proveedores } from 'src/models/proveedores.model';

@Module({
  imports: [SequelizeModule.forFeature([Proveedores])],
  controllers: [ProveedoresController],
  providers: [ProveedoresService],
})
export class ProveedoresModule {}
