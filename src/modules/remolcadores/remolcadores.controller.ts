import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RemolcadoresService } from './remolcadores.service';
import { CreateRemolcadoreDto } from './dto/create-remolcadore.dto';
import { UpdateRemolcadoreDto } from './dto/update-remolcadore.dto';

@Controller('remolcadores')
export class RemolcadoresController {
  constructor(private readonly remolcadoresService: RemolcadoresService) {}

  @Post()
  create(@Body() createRemolcadoreDto: CreateRemolcadoreDto) {
    return this.remolcadoresService.create(createRemolcadoreDto);
  }

  @Get()
  findAll() {
    return this.remolcadoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.remolcadoresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRemolcadoreDto: UpdateRemolcadoreDto) {
    return this.remolcadoresService.update(+id, updateRemolcadoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.remolcadoresService.remove(+id);
  }
}
