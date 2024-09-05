import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateBoxDto {
  @IsPositive()
  @IsNotEmpty()
  numeracion: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;
}
