import { Controller, Get, Param, Sse } from '@nestjs/common';
import { BalancesService } from './balances.service';

@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService ){}

}
