import { forwardRef, Module } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { BalancesController } from './balances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from './entities/balance.entity';
import { BalanceRewardsListener } from './listeners/set-reward.listener';
import { UsersModule } from '../users/users.module';
import { EventsService } from './events.service';

@Module({
  imports:[
    forwardRef(()=>UsersModule),
    TypeOrmModule.forFeature([Balance])],
  controllers: [BalancesController],
  providers: [BalancesService, BalanceRewardsListener, EventsService],
  exports:[BalancesService]
})
export class BalancesModule {}
