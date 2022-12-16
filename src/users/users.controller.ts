import { Controller, Get, Post, Body, Patch, Param, Delete, Sse } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}



  @Post()/////Убрать потом
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
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

  @Post(':id/reward')
  async setReward(@Param('id') id: string){
    const res = await this.usersService.setRewards(+id);
    return res;
  }

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

}
