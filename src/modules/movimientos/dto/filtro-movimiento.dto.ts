import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class FiltroMovimientoDto {
  @IsOptional()
  @IsNumber()
  productoId?: number;

  @IsOptional()
  @IsNumber()
  proveedorId?: number;

  @IsOptional()
  @IsNumber()
  importadorId?: number;

  @IsOptional()
  @IsNumber()
  buqueId?: number;

  @IsOptional()
  @IsNumber()
  estadoId?: number;

  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;
}
