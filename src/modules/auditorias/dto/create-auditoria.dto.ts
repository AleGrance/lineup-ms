import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateAuditoriaDto {
  @IsString({ message: 'El campo campoModificado debe ser un string' })
  @IsNotEmpty({ message: 'El campo campoModificado no debe estar vacío' })
  campoModificado: string;

  @IsOptional()
  valorAnterior: string;

  @IsOptional()
  valorActual: string;

  @IsString({ message: 'El campo usuarioResponsable debe ser un string' })
  @IsNotEmpty({ message: 'El campo usuarioResponsable no debe estar vacío' })
  usuarioResponsable: string;

  @IsPositive({ message: 'El campo movimientoId debe ser un número positivo' })
  @IsNotEmpty({ message: 'El campo movimientoId no debe estar vacío' })
  movimientoId: number;
}
