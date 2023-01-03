import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BalancesModule } from '../balances/balances.module';
import { HandfaucetsModule } from '../handfaucets/handfaucets.module';
import { AuthModule } from '../auth/auth.module';
import { AutofaucetsModule } from '../autofaucets/autofaucets.module';
import { EventsModule } from '../events/events.module';
import { NotificationsService } from '../events/notifications.service';
import { UserEventsListener } from './listeners/user-events.listener';
import { BonusesModule } from '../bonuses/bonuses.module';

@Module({
  imports:[
    EventsModule,
    forwardRef(()=>AuthModule),
    forwardRef(()=>AutofaucetsModule),
    forwardRef(()=>BonusesModule),
    TypeOrmModule.forFeature([User]),
    BalancesModule,
    HandfaucetsModule],

  controllers: [UsersController],
  providers: [UsersService,NotificationsService, UserEventsListener],
  exports:[UsersService]
})
export class UsersModule {}
