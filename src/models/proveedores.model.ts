import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Movimientos } from './movimientos.model';

@Table
export class Proveedores extends Model<Proveedores> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  proveedorId: number;

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
