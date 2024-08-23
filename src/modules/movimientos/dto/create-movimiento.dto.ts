import {
  IsDateString,
  IsNotEmpty,
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
  barcazaId: number;

  @IsPositive()
  @IsNotEmpty()
  remolcadorId: number;

  @IsPositive()
  @IsNotEmpty()
  boxId: number;

  @IsPositive()
  @IsNotEmpty()
  puertoId: number;
}
