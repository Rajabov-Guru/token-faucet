import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BalancesModule } from '../balances/balances.module';
import { HandfaucetsModule } from '../handfaucets/handfaucets.module';
import { AuthModule } from '../auth/auth.module';
import { AutofaucetsModule } from '../autofaucets/autofaucets.module';

@Module({
  imports:[
    forwardRef(()=>AuthModule),
    forwardRef(()=>AutofaucetsModule),
    TypeOrmModule.forFeature([User]),
    BalancesModule,
    HandfaucetsModule],

  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
