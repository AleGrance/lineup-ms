import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImportadorDto {
  @IsString()
  @IsNotEmpty()
  ruc: string;

  @IsString()
  @IsNotEmpty()
  razonSocial: string;
}
