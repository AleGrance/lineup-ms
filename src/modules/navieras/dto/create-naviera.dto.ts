import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNavieraDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
