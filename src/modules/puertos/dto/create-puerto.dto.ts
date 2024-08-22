import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePuertoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
