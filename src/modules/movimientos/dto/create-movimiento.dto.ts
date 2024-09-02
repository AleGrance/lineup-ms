import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsTimeZone,
} from 'class-validator';

export class CreateMovimientoDto {
  @IsPositive()
  @IsNotEmpty()
  cantidad: number;

  @IsNotEmpty()
  @IsDateString()
  fechaProbDescarga: Date;

  @IsNotEmpty()
  @IsDateString()
  fechaArribo: Date;

  @IsNotEmpty()
  horaInicio: Date;

  @IsNotEmpty()
  horaFin: Date;

  @IsNotEmpty()
  barcaza: string;

  /**
   *  RELATIONS
   */

  @IsPositive()
  @IsNotEmpty()
  importadorId: number;

  @IsPositive()
  @IsNotEmpty()
  proveedorId: number;

  @IsPositive()
  @IsNotEmpty()
  productoId: number;

  @IsPositive()
  @IsNotEmpty()
  buqueId: number;

  @IsPositive()
  @IsNotEmpty()
  navieraId: number;

  @IsPositive()
  @IsNotEmpty()
  remolcadorId: number;

  @IsPositive()
  @IsNotEmpty()
  boxId: number;

  @IsPositive()
  @IsNotEmpty()
  puertoId: number;

  @IsPositive()
  @IsOptional()
  estadoId: number;

  @IsString()
  @IsOptional()
  usuarioCreador: string;
}
