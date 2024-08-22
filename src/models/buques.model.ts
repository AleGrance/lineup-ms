import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Movimientos } from './movimientos.model';

@Table
export class Buques extends Model<Buques> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  buqueId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  nombre: string;

  // Movimiento
  @HasMany(() => Movimientos)
  movimientos: Movimientos[]
}
