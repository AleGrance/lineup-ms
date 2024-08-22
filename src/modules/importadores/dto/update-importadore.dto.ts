import { PartialType } from '@nestjs/mapped-types';
import { CreateImportadorDto } from './create-importadore.dto';

export class UpdateImportadorDto extends PartialType(CreateImportadorDto) {}
