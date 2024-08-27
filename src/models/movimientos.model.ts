import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Importadores } from './importadores.model';
import { Proveedores } from './proveedores.model';
import { Productos } from './productos.model';
import { Buques } from './buques.model';
import { Barcazas } from './barcazas.model';
import { Remolcadores } from './remolcadores.model';
import { Boxes } from './boxes.model';
import { Puertos } from './puertos.model';
import { Estados } from './estados';
import { Auditorias } from './auditorias';

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

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  urlManifiesto: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  urlBL: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  urlExpediente: string;

  /**
   *  RELATIONS
   */

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
  proveedor: Proveedores;

  // Producto
  @ForeignKey(() => Productos)
  @Column
  productoId: number;

  @BelongsTo(() => Productos)
  producto: Productos;

  // Buque
  @ForeignKey(() => Buques)
  @Column
  buqueId: number;

  @BelongsTo(() => Buques)
  buque: Buques;

  // Barcaza
  @ForeignKey(() => Barcazas)
  @Column
  barcazaId: number;

  @BelongsTo(() => Barcazas)
  barcaza: Barcazas;

  // Remolcador
  @ForeignKey(() => Remolcadores)
  @Column
  remolcadorId: number;

  @BelongsTo(() => Remolcadores)
  remolcador: Remolcadores;

  // Box
  @ForeignKey(() => Boxes)
  @Column
  boxId: number;

  @BelongsTo(() => Boxes)
  box: Boxes;

  // Puerto
  @ForeignKey(() => Puertos)
  @Column
  puertoId: number;

  @BelongsTo(() => Puertos)
  puerto: Puertos;

  // Estado
  @ForeignKey(() => Estados)
  @Column({
    defaultValue: 2
  })
  estadoId: number;

  @BelongsTo(() => Estados)
  estado: Estados;

  // Auditoria
  @HasMany(() => Auditorias)
  auditorias: Auditorias[]
}
