import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBuqueDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
