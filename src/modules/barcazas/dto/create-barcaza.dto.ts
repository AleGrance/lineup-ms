import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBarcazaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
