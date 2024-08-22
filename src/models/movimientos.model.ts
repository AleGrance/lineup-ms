import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Importadores } from './importadores.model';
import { Proveedores } from './proveedores.model';
import { Productos } from './productos.model';
import { Buques } from './buques.model';
import { Barcazas } from './barcazas.model';
import { Remolcadores } from './remolcadores.model';
import { Boxes } from './boxes.model';
import { Puertos } from './puertos.model';

@Table
export class Movimientos extends Model<Movimientos> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  movimientoId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cantidad: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  fechaProbDescarga: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  fechaArribo: Date;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  horaInicio: Date;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  horaFin: Date;

  // Importador
  @ForeignKey(() => Importadores)
  @Column
  importadorId: number;

  @BelongsTo(() => Importadores)
  importador: Importadores;

  // Proveedor
  @ForeignKey(() => Proveedores)
  @Column
  proveedorId: number;

  @BelongsTo(() => Proveedores)
  proveedor: Importadores;

  // Producto
  @ForeignKey(() => Productos)
  @Column
  productoId: number;

  @BelongsTo(() => Productos)
  producto: Importadores;

  // Buque
  @ForeignKey(() => Buques)
  @Column
  buqueId: number;

  @BelongsTo(() => Buques)
  buque: Importadores;

  // Barcaza
  @ForeignKey(() => Barcazas)
  @Column
  barcazaId: number;

  @BelongsTo(() => Barcazas)
  barcaza: Importadores;

  // Remolcador
  @ForeignKey(() => Remolcadores)
  @Column
  remolcadorId: number;

  @BelongsTo(() => Remolcadores)
  remolcador: Importadores;

  // Box
  @ForeignKey(() => Boxes)
  @Column
  boxId: number;

  @BelongsTo(() => Boxes)
  box: Importadores;

  // Puerto
  @ForeignKey(() => Puertos)
  @Column
  puertoId: number;

  @BelongsTo(() => Puertos)
  puerto: Importadores;
}
