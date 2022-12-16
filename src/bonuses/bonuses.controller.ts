import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BonusesService } from './bonuses.service';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';

@Controller('bonuses')
export class BonusesController {
  constructor(private readonly bonusesService: BonusesService) {}

  @Post()
  create(@Body() createBonusDto: CreateBonusDto) {
    return this.bonusesService.create(createBonusDto);
  }

  @Get()
  findAll() {
    return this.bonusesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bonusesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBonusDto: UpdateBonusDto) {
    return this.bonusesService.update(+id, updateBonusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bonusesService.remove(+id);
  }
}
