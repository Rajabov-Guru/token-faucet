import { forwardRef, Module } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { BalancesController } from './balances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from './entities/balance.entity';
import { BalanceEventsListener } from './listeners/balance-events.listener';
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../events/events.module';
import { NotificationsService } from '../events/notifications.service';

@Module({
  imports:[
    EventsModule,
    forwardRef(()=>UsersModule),
    TypeOrmModule.forFeature([Balance])],
  controllers: [BalancesController],
  providers: [BalancesService, NotificationsService,BalanceEventsListener],
  exports:[BalancesService]
})
export class BalancesModule {}
