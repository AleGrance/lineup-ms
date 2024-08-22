import { PartialType } from '@nestjs/mapped-types';
import { CreatePuertoDto } from './create-puerto.dto';

export class UpdatePuertoDto extends PartialType(CreatePuertoDto) {}
