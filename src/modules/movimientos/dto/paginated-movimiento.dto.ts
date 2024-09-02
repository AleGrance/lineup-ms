import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaginatedMovimientoDto {
  @IsNotEmpty()
  data: any[];
  @IsNumber()
  recordsTotal: number;
  @IsNumber()
  recordsFiltered: number;
}
