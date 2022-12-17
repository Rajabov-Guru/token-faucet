import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { BalancesModule } from './balances/balances.module';
import { BonusesModule } from './bonuses/bonuses.module';
import { HandfaucetsModule } from './handfaucets/handfaucets.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsService } from './events.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath:`.${process.env.NODE_ENV}.env`
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    BalancesModule,
    BonusesModule,
    HandfaucetsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [EventsService],
  exports:[EventsService]
})
export class AppModule {}
