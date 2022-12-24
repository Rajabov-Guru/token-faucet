import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AutofaucetsService } from './autofaucets.service';
import { CreateAutofaucetDto } from './dto/create-autofaucet.dto';
import { UpdateAutofaucetDto } from './dto/update-autofaucet.dto';

@Controller('autofaucets')
export class AutofaucetsController {
  constructor(private readonly autofaucetsService: AutofaucetsService) {}

  @Get()
  findAll() {
    return this.autofaucetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.autofaucetsService.findOne(+id);
  }

}
