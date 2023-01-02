import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BalancesService } from '../balances/balances.service';
import { HandfaucetsService } from '../handfaucets/handfaucets.service';
import { getSettings, getVipDiscount } from '../settings/faucet.settings';
import { SetRewardDto } from '../balances/dto/set-reward.dto';
import { AutofaucetsService } from '../autofaucets/autofaucets.service';
import { autoFaucetGeneralSettings, getAutoSettings, getSubscriptionDiscount } from '../settings/autofaucet.settings';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FaucetEvent } from './events/faucet.event';

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

  @Inject(EventEmitter2)
  private eventEmitter: EventEmitter2;

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
  }

  //Действие при старте: Восстановление всех таймоутов
  async onApplicationBootstrap(){
    console.log('Set all handfaucet timeouts')
    await this.handfaucetService.setAllTimeouts();
    console.log('Set all autofaucet timeouts')
    await this.autofaucetService.setAllTimeouts();
  }

  //Действие:
  async create(createUserDto: CreateUserDto) {
    const newUser = createUserDto as User;
    await this.userRepository.save(newUser);
    if(createUserDto.refererLogin){
      newUser.referer = await this.findByLogin(createUserDto.refererLogin);
      newUser.isReferal = true;
      await this.userRepository.save(newUser);
    }
    await this.balanceService.create(newUser);
    await this.handfaucetService.create(newUser);
    await this.autofaucetService.create(newUser);
    return this.userRepository.save(newUser);
  }

  async save(user:User){
    return this.userRepository.save(user);
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

  async findAll() {
    return this.userRepository.find();
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

  async checkLoyal(userId:number){
    const user = await this.userRepository.findOne({
      where:{id:userId},
      relations:{
        handfaucet:true,
        autofaucet:true,
      }
    });
    if(user.autofaucet.activated && user.handfaucet.level >= 3){
      user.isLoyal = true;
      return true;
    }
    else{
      user.isLoyal = false;
      return false;
    }
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
    let base = rewards.base;
    if(handfaucet.vip){//VIP
      base*=2;
    }
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

    const userEvent = new FaucetEvent(handfaucet.id, user.id);
    this.eventEmitter.emit('handfaucet_add_tokens', userEvent);
    return res;
  }

  async buyVip(userId:number,months:number){
    const user = await this.userRepository.findOne({
      where:{
        id:userId
      },
      relations:{
        handfaucet:true,
        balance:true,
      }
    });

    const balance = user.balance;
    const handfaucet = user.handfaucet;

    const settings = getSettings(handfaucet.level);
    const vipCost = settings.vipCost;
    const discount = getVipDiscount(months);
    const diff = vipCost * (discount/100);
    const cost = vipCost - diff;

    await this.balanceService.minusSatoshi(balance.id,cost);

    await this.handfaucetService.setVip(handfaucet.id,months);

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

  async subscribeAutoFaucet(id:number, months:number){
    const user = await this.userRepository.findOne({
      where:{id},
      relations:{
        autofaucet:true,
        balance:true,
      }
    })
    let autofaucet = user.autofaucet;
    const balance = user.balance;

    const settings = getAutoSettings(autofaucet.level);
    const discount = getSubscriptionDiscount(months);
    const diff = settings.subscriptionCost * (discount/100);
    const cost = settings.subscriptionCost - diff;

    await this.balanceService.minusSatoshi(balance.id,cost);
    console.log(`cost: ${cost}`);

    autofaucet = await this.autofaucetService.setSubscription({autofaucetId:autofaucet.id,months:months});
    await this.activateAutofaucetSubscription(user.id,autofaucet.id);
    return autofaucet;
  }

  async activateAutofaucetSubscription(userId:number,autofaucetId:number){
    const userEvent = new FaucetEvent(userId,autofaucetId);
    this.eventEmitter.emit('autofaucet_subscription_activate',userEvent);
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

    const oneCycleEnergy = Math.floor((user.autofaucet.timerAmount*60)/autoFaucetGeneralSettings.secondsForOneSatoshi);
    const cycles = Math.floor(user.balance.energy/oneCycleEnergy);
    if(cycles<=0){
      throw new HttpException('Not enough energy',HttpStatus.BAD_REQUEST);
    }
    const energy = cycles*oneCycleEnergy;
    console.log(`
      oneCycleEnergy:${oneCycleEnergy}
      cycles: ${cycles}
      energy: ${energy}
    `);
    await this.balanceService.minusEnergy(user.balance.id,energy);
    await this.autofaucetService.activateAutofaucet(user.autofaucet.id,cycles, false);
    return user;
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
    this.eventEmitter.emit('autofaucet_add_satoshi',new FaucetEvent(user.id,autofaucet.id));
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

}
