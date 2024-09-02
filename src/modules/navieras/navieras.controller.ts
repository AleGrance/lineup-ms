import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NavierasService } from './navieras.service';
import { CreateNavieraDto } from './dto/create-naviera.dto';
import { UpdateNavieraDto } from './dto/update-naviera.dto';

@Controller('navieras')
export class NavierasController {
  constructor(private readonly navierasService: NavierasService) {}

  @Post()
  create(@Body() createNavieraDto: CreateNavieraDto) {
    return this.navierasService.create(createNavieraDto);
  }

  @Get()
  findAll() {
    return this.navierasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.navierasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNavieraDto: UpdateNavieraDto) {
    return this.navierasService.update(+id, updateNavieraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.navierasService.remove(+id);
  }
}
