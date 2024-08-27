import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateAuditoriaDto {
  @IsString()
  campoModificado: string;
  @IsString()
  valorAnterior: string;
  @IsString()
  valorActual: string;
  @IsString()
  usuarioResponsable: string;
  @IsPositive()
  movimientoId: number;
}
