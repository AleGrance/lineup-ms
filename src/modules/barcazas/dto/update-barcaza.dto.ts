import { PartialType } from '@nestjs/mapped-types';
import { CreateBarcazaDto } from './create-barcaza.dto';

export class UpdateBarcazaDto extends PartialType(CreateBarcazaDto) {}
