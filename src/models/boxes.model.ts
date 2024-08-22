import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Movimientos } from './movimientos.model';

@Table
export class Boxes extends Model<Boxes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  boxId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  capacidad: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  marca: string;

  // Movimiento
  @HasMany(() => Movimientos)
  movimientos: Movimientos[];
}
