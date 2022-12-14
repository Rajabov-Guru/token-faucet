import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Get(':id/balance')
  async getBalance(@Param('id') id: string) {
    const balance = await this.usersService.getBalance(+id);
    return balance;
  }

  @Get(':id/handfaucet')
  async getHandFaucet(@Param('id') id: string) {
    const faucet = await this.usersService.getHandFaucet(+id)
    return faucet;
  }

  @Post(':id/handfaucet/reward')
  async setReward(@Param('id') id: string){
    const res = await this.usersService.setRewards(+id);
    return res;
  }

  @Post(':id/handfaucet/vip/:months')
  async buyVip(@Param('id') id: string, @Param('months') months: string){
    return await this.usersService.buyVip(+id,+months);
  }

  @Get(':id/autofaucet')
  async getAutoFaucet(@Param('id') id: string) {
    const faucet = await this.usersService.getAutoFaucet(+id)
    return faucet;
  }

  @Post(':id/autofaucet/activate')
  async activateAutoFaucetByEnergy(@Param('id') id: string){
    return this.usersService.activateAutoFaucetByEnergy(+id);
  }

  @Post(':id/autofaucet/subscribe/:months')
  async subscribe(@Param('id') id: string, @Param('months') months: string){
    return this.usersService.subscribeAutoFaucet(+id,+months);
  }

  @Get(':id/referer')
  async getReferer(@Param('id') id: string) {
    const referer = await this.usersService.getReferer(+id);
    return referer;
  }

  @Get(':id/referals')
  async getReferals(@Param('id') id: string) {
    const referals = await this.usersService.getReferals(+id);
    return referals;
  }


}
