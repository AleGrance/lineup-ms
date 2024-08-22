import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Movimientos } from './movimientos.model';

@Table
export class Importadores extends Model<Importadores> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  importadorId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  razonSocial: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  ruc: string;

  // Movimiento
  @HasMany(() => Movimientos)
  movimientos: Movimientos[]
}
