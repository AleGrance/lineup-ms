import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImportadoresService } from './importadores.service';
import { CreateImportadorDto } from './dto/create-importadore.dto';
import { UpdateImportadorDto } from './dto/update-importadore.dto';

@Controller('importadores')
export class ImportadoresController {
  constructor(private readonly importadoresService: ImportadoresService) {}

  @Post()
  create(@Body() createImportadorDto: CreateImportadorDto) {
    return this.importadoresService.create(createImportadorDto);
  }

  @Get()
  findAll() {
    return this.importadoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importadoresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImportadoreDto: UpdateImportadorDto) {
    return this.importadoresService.update(+id, updateImportadoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.importadoresService.remove(+id);
  }
}
