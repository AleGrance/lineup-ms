import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProveedoreDto {
  @IsString()
  @IsNotEmpty()
  ruc: string;

  @IsString()
  @IsNotEmpty()
  razonSocial: string;
}
