import { Controller, Get, Param } from '@nestjs/common';
import { HandfaucetsService } from './handfaucets.service';


@Controller('handfaucets')
export class HandfaucetsController {

  constructor(private readonly handfaucetsService: HandfaucetsService) {}

  @Get()
  findAll() {
    return this.handfaucetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.handfaucetsService.findOne(+id);
  }

}
