import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PaginationMovimientoDto {
  // @IsNotEmpty()
  // search: {
  //   value: string;
  // };

  @IsNumber()
  start: number;
  @IsNumber()
  length: number;

  @IsOptional()
  order: [{
    column: number;
    name: string;
    dir: string;
  }];
}
