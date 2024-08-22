import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRemolcadoreDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
