import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Movimientos } from './movimientos.model';

@Table
export class Estados extends Model<Estados> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  estadoId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  nombre: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  class: string;

  // Movimiento
  @HasMany(() => Movimientos)
  movimientos: Movimientos[]
}
