import { PartialType } from '@nestjs/mapped-types';
import { CreateNavieraDto } from './create-naviera.dto';

export class UpdateNavieraDto extends PartialType(CreateNavieraDto) {}
