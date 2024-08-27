import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Movimientos } from './movimientos.model';

@Table
export class Auditorias extends Model<Auditorias> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  auditoriaId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  campoModificado: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  valorAnterior: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  valorActual: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  usuarioResponsable: string;

  // Movimiento
  @ForeignKey(() => Movimientos)
  @Column
  movimientoId: number;

  @BelongsTo(() => Movimientos)
  movimiento: Movimientos;
}
