import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BalancesService } from '../balances/balances.service';
import { HandfaucetsService } from '../handfaucets/handfaucets.service';
import { Balance } from '../balances/entities/balance.entity';
import { Handfaucet } from '../handfaucets/entities/handfaucet.entity';
import { getSettings, handfaucetSettings } from '../settings/faucet.settings';
import { SetRewardDto } from '../balances/dto/set-reward.dto';
import { Autofaucet } from '../autofaucets/entities/autofaucet.entity';
import { AutofaucetsService } from '../autofaucets/autofaucets.service';
import { ActivateByEnergyDto } from '../autofaucets/dto/activate-by-energy.dto';
import { getAutoSettings } from '../settings/autofaucet.settings';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class UsersService {
  @Inject(BalancesService)
  private readonly balanceService:BalancesService;

  @Inject(HandfaucetsService)
  private readonly handfaucetService:HandfaucetsService;

  @Inject(AutofaucetsService)
  private readonly autofaucetService:AutofaucetsService;

  @Inject(SchedulerRegistry)
  private schedulerRegistry: SchedulerRegistry;

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
  }

  async onApplicationBootstrap(){//
    console.log('Set all handfaucet timeouts')
    await this.handfaucetService.setAllTimeouts();
    console.log('Set all autofaucet timeouts')
    await this.autofaucetService.setAllTimeouts();
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = createUserDto as User;
    await this.userRepository.save(newUser);

    if(createUserDto.refererLogin){
      const referer = await this.findByLogin(createUserDto.refererLogin);
      newUser.referer = referer;
      newUser.isReferal = true;
      await this.userRepository.save(newUser);
    }

    const balance = new Balance();
    balance.user = newUser;
    await this.balanceService.save(balance);

    const handfaucet = new Handfaucet();
    handfaucet.user = newUser;
    await this.handfaucetService.save(handfaucet);

    const autofaucet = new Autofaucet();
    autofaucet.user = newUser;
    await this.autofaucetService.save(autofaucet);

    //bonuses
    return this.userRepository.save(newUser);

  }

  async findAll() {
    return this.userRepository.find();
  }

  async getReferer(id:number){
    const user = await this.userRepository.findOne({
      where:{id},
      relations:{
        referer:true
      }
    });
    return user.referer;
  }

  async getReferals(id:number){
    const user = await this.userRepository.findOne({
      where:{id},
      relations:{
        referals:true
      }
    });
    return user.referals;
  }

  async getBalance(id:number){
    const user = await this.userRepository.findOne({
      where:{id},
      relations:{
        balance:true
      }
    });
    return user.balance;
  }

  async getHandFaucet(id:number){
    const user = await this.userRepository.findOne({
      where:{id},
      relations:{
        handfaucet:true
      }
    });
    return user.handfaucet;
  }

  async getAutoFaucet(id:number){
    const user = await this.userRepository.findOne({
      where:{id},
      relations:{
        autofaucet:true
      }
    });
    return user.autofaucet;
  }

  async activateAutoFaucetByEnergy(userId:number){
    const user = await this.userRepository.findOne({
      where: {
        id:userId
      },
      relations:{
          balance:true,
          autofaucet:true,
      }
    });

    const energy = user.balance.energy;
    user.balance.energy = 0;
    await this.balanceService.save(user.balance);
    return this.autofaucetService.activateByEnergy({id:user.autofaucet.id,energy});
  }

  async setRewards(id:number){
    const user = await this.userRepository.findOne({
      where:{
        id
      },
      relations:{
        handfaucet:true,
        balance:true,
      }
    });

    const balance = user.balance;
    const handfaucet = user.handfaucet;

    const settings = getSettings(handfaucet.level);
    const rewards = settings.rewards;

    const bonuses = rewards.levelBonus;
    const base = rewards.base;
    const experience = rewards.experience;
    const energy = rewards.energy;
    const satoshi = 0;
    const clicks = 0;
    const tokens = base+(base / 100 * bonuses)

    const data:SetRewardDto={
      tokens,
      experience,
      energy,
      satoshi,
      clicks
    }
    const res = await this.balanceService.setRewards(balance.id,data);
    await this.handfaucetService.addTokens(handfaucet.id,tokens,energy);
    return res;
  }


  async setAutoRewards(id:number){
    const user = await this.userRepository.findOne({
      where:{
        id
      },
      relations:{
        autofaucet:true,
        balance:true,
      }
    });

    const balance = user.balance;
    const autofaucet = user.autofaucet;

    const settings = getAutoSettings(autofaucet.level);
    const rewards = settings.rewards;

    const bonuses = rewards.levelBonus;
    const base = rewards.base;
    const experience = rewards.experience;
    const energy = 0;
    const tokens = 0;
    const clicks = 0;
    const satoshi = base+(base / 100 * bonuses)

    const data:SetRewardDto={
      tokens,
      experience,
      energy,
      satoshi,
      clicks
    }
    const res = await this.balanceService.setRewards(balance.id,data);
    await this.autofaucetService.addSatoshi(autofaucet.id,satoshi);
    return res;
  }

  async getToken(id:number){
    const user = await this.userRepository.findOne({
      where:{id},
      relations:{
        token:true
      }
    });
    return user.token;
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findByEmail(email:string){
    return this.userRepository.findOneBy({email});
  }

  findByLogin(login:string){
    return this.userRepository.findOneBy({login});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    return this.userRepository.save({...user, ...updateUserDto});
  }

  async save(user:User){
    return this.userRepository.save(user);
  }

}
