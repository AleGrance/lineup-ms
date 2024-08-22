import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BuquesService } from './buques.service';
import { CreateBuqueDto } from './dto/create-buque.dto';
import { UpdateBuqueDto } from './dto/update-buque.dto';

@Controller('buques')
export class BuquesController {
  constructor(private readonly buquesService: BuquesService) {}

  @Post()
  create(@Body() createBuqueDto: CreateBuqueDto) {
    return this.buquesService.create(createBuqueDto);
  }

  @Get()
  findAll() {
    return this.buquesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buquesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBuqueDto: UpdateBuqueDto) {
    return this.buquesService.update(+id, updateBuqueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buquesService.remove(+id);
  }
}
