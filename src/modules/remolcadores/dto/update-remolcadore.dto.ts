import { PartialType } from '@nestjs/mapped-types';
import { CreateRemolcadoreDto } from './create-remolcadore.dto';

export class UpdateRemolcadoreDto extends PartialType(CreateRemolcadoreDto) {}
