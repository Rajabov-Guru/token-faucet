import { Controller, Get, Param, Sse } from '@nestjs/common';
import { BalancesService } from './balances.service';

@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService ){}

  @Get()
  findAll() {
    return this.balancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.balancesService.findOne(+id);
  }

}
