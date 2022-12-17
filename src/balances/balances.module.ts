import { forwardRef, Module } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { BalancesController } from './balances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from './entities/balance.entity';
import { BalanceEventsListener } from './listeners/balance-events.listener';
import { UsersModule } from '../users/users.module';
import { EventsService } from '../events.service';

@Module({
  imports:[
    forwardRef(()=>UsersModule),
    TypeOrmModule.forFeature([Balance])],
  controllers: [BalancesController],
  providers: [BalancesService, BalanceEventsListener, EventsService],
  exports:[BalancesService]
})
export class BalancesModule {}
