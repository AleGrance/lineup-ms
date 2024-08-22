import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Movimientos } from './movimientos.model';

@Table
export class Productos extends Model<Productos> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  productoId: number;

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
