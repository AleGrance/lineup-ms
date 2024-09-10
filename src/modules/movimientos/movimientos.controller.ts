import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { FiltroMovimientoDto } from './dto/filtro-movimiento.dto';
import { PaginationMovimientoDto } from './dto/pagination-movimiento.dto';

@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  @Post()
  create(@Body() createMovimientoDto: CreateMovimientoDto) {
    return this.movimientosService.create(createMovimientoDto);
  }

  @Get()
  findAll() {
    return this.movimientosService.findAll();
  }

  @Patch('removeFile/:id')
  removeFile(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.movimientosService.removeFile(
      +id,
      body,
      body.usuarioResponsable,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovimientoDto: UpdateMovimientoDto,
  ) {
    return this.movimientosService.update(
      +id,
      updateMovimientoDto,
      updateMovimientoDto.usuarioResponsable,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movimientosService.remove(+id);
  }

  /**
   * Filtro
   */

  @Post('filtrados')
  filtrarMovimientos(@Body() filtroMovimientoDto: FiltroMovimientoDto) {
    return this.movimientosService.filtrarMovimientos(filtroMovimientoDto);
  }

  /**
   * Paginacion
   */
  @Post('paginados')
  getMovimientosPaginados(
    @Body() paginationMovimientoDto: PaginationMovimientoDto,
  ) {
    // console.log(paginationMovimientoDto);
    return this.movimientosService.getMovimientosPaginados(
      paginationMovimientoDto,
    );
  }

  /**
   * Reporte en linea
   */
  @Get('reporte-linea')
  getMovimientosLinea() {
    return this.movimientosService.getMovimientosLinea();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movimientosService.findOne(+id);
  }
}
