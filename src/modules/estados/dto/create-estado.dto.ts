import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEstadoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  class: string;
}
