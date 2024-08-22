import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Movimientos } from './movimientos.model';

@Table
export class Remolcadores extends Model<Remolcadores> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  remolcadorId: number;

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
