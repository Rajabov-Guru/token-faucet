import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { BalancesModule } from './balances/balances.module';
import { HandfaucetsModule } from './handfaucets/handfaucets.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsModule } from './events/events.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AutofaucetsModule } from './autofaucets/autofaucets.module';
import { BonusesModule } from './bonuses/bonuses.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath:`.${process.env.NODE_ENV}.env`
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    BalancesModule,
    HandfaucetsModule,
    AuthModule,
    EventsModule,
    AutofaucetsModule,
    BonusesModule
  ],
  controllers: [],
  providers: [],
  exports:[]
})
export class AppModule {}
