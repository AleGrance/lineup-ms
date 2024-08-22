import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PuertosService } from './puertos.service';
import { CreatePuertoDto } from './dto/create-puerto.dto';
import { UpdatePuertoDto } from './dto/update-puerto.dto';

@Controller('puertos')
export class PuertosController {
  constructor(private readonly puertosService: PuertosService) {}

  @Post()
  create(@Body() createPuertoDto: CreatePuertoDto) {
    return this.puertosService.create(createPuertoDto);
  }

  @Get()
  findAll() {
    return this.puertosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.puertosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePuertoDto: UpdatePuertoDto) {
    return this.puertosService.update(+id, updatePuertoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.puertosService.remove(+id);
  }
}
