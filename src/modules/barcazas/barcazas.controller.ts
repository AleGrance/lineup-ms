import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BarcazasService } from './barcazas.service';
import { CreateBarcazaDto } from './dto/create-barcaza.dto';
import { UpdateBarcazaDto } from './dto/update-barcaza.dto';

@Controller('barcazas')
export class BarcazasController {
  constructor(private readonly barcazasService: BarcazasService) {}

  @Post()
  create(@Body() createBarcazaDto: CreateBarcazaDto) {
    return this.barcazasService.create(createBarcazaDto);
  }

  @Get()
  findAll() {
    return this.barcazasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.barcazasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBarcazaDto: UpdateBarcazaDto) {
    return this.barcazasService.update(+id, updateBarcazaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.barcazasService.remove(+id);
  }
}
