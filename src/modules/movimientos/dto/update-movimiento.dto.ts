import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimientoDto } from './create-movimiento.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMovimientoDto extends PartialType(CreateMovimientoDto) {
    @IsOptional()
    @IsString()
    urlManifiesto?: string;
  
    @IsOptional()
    @IsString()
    urlBL?: string;
  
    @IsOptional()
    @IsString()
    urlExpediente?: string;  

    @IsOptional()
    @IsString()
    urlDespacho?: string;  

    @IsOptional()
    @IsString()
    usuarioResponsable?: string;  
}
