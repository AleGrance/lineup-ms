import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateBoxDto {
  @IsPositive()
  @IsNotEmpty()
  capacidad: number;

  @IsString()
  @IsNotEmpty()
  marca: string;
}
