import { Injectable } from '@nestjs/common';
import { faucetLevelBonus } from './items/faucet-level.bonus';
import { BonusSetting } from './models/BonusSetting';
import { userAchieveLevelBonus } from './items/user-achieve-level.bonus';
import { faucetAchieveLevelBonus } from './items/faucet-achieve-level.bonus';
import { userLoyaltyBonus } from './items/user-loyalty.bonus';
import { refAchieveLevelBonus } from './items/ref-achieve-level.bonus';
import { refFaucetAchieveLevelBonus } from './items/ref-faucet-achieve-level.bonus';
import { refLoyaltyBonus } from './items/ref-loyalty.bonus';
import { User } from '../users/entities/user.entity';
import { Handfaucet } from '../handfaucets/entities/handfaucet.entity';
import { Autofaucet } from '../autofaucets/entities/autofaucet.entity';

@Injectable()
export class BonusesService{

  getAllHandFaucetBonusesValue(user:User, faucet:Handfaucet){
    let result = 0;
    const handfaucetBonuses = this.getAllHandFaucetBonuses(faucet);
    console.log('HANDFAUCET BONUSES:');
    for (const handfaucetBonus of handfaucetBonuses) {
      console.log(handfaucetBonus.value);
      result += handfaucetBonus.value;
    }
    const userBonuses = this.getAllUserBonuses(user);
    console.log('USER BONUSES:');
    for (const userBonus of userBonuses) {
      console.log(userBonus.value);
      result += userBonus.value;
    }
    console.log(`BonusesValue: ${result}`);
    return result;
  }

  getAllAutoFaucetBonusesValue(user:User, faucet:Autofaucet){
    let result = 0;
    const autofaucetBonuses = this.getAllAutoFaucetBonuses(faucet);
    console.log('AutoFAUCET BONUSES:');
    for (const autofaucetBonus of autofaucetBonuses) {
      console.log(autofaucetBonus.value);
      result += autofaucetBonus.value;
    }
    const userBonuses = this.getAllUserBonuses(user);
    console.log('USER BONUSES:');
    for (const userBonus of userBonuses) {
      console.log(userBonus.value);
      result += userBonus.value;
    }
    console.log(`BonusesValue: ${result}`);
    return result;
  }

  getAllHandFaucetBonuses(faucet:Handfaucet):BonusSetting[]{
    const result:BonusSetting[] = [];
    result.push(this.getHandfaucetLevelBonus(faucet.level));
    result.push(this.getHandFaucetAchieveLevelBonus(faucet.level));
    // result.push(this.getRefHandFaucetAchieveLevelBonus());
    return result;
  }

  getAllAutoFaucetBonuses(faucet:Autofaucet):BonusSetting[]{
    const result:BonusSetting[] = [];
    result.push(this.getAutofaucetLevelBonus(faucet.level));
    result.push(this.getAutoFaucetAchieveLevelBonus(faucet.level));
    // result.push(this.getRefHandFaucetAchieveLevelBonus());
    return result;
  }

  getAllUserBonuses(user:User):BonusSetting[]{
    const result:BonusSetting[] = [];
    result.push(this.getUserAchieveLevelBonus(user.level));
    result.push(this.getUserLoyaltyBonus(user.isLoyal));
    // result.push(this.getRefAchieveLevelBonus(userLevel));
    // result.push(this.getRefLoyaltyBonus());
    return result;
  }

  getUserAchieveLevelBonus(userLevel:number):BonusSetting{
    const bonus = userAchieveLevelBonus;
    return new BonusSetting(bonus.value*userLevel,bonus.clicks);
  }

  getUserLoyaltyBonus(isLoyal:boolean):BonusSetting{
    const bonus = userLoyaltyBonus;
    return new BonusSetting(isLoyal?bonus.value:0,0);
  }

  getRefAchieveLevelBonus(userLevel:number):BonusSetting{
    return refAchieveLevelBonus;
  }

  getRefLoyaltyBonus():BonusSetting{
    return refLoyaltyBonus;
  }

  getHandfaucetLevelBonus(faucetLevel:number):BonusSetting{
    if(faucetLevel>11) faucetLevel = 11;
    return faucetLevelBonus.filter(bonus=>bonus.level===faucetLevel)[0].handfaucetBonus;
  }

  getHandFaucetAchieveLevelBonus(faucetLevel:number):BonusSetting{
    if(faucetLevel>11) faucetLevel = 11;
    return faucetAchieveLevelBonus.filter(bonus=>bonus.level===faucetLevel)[0].handfaucetBonus;
  }

  getRefHandFaucetAchieveLevelBonus():BonusSetting{
    return refFaucetAchieveLevelBonus.handfaucetBonus;
  }

  getAutoFaucetAchieveLevelBonus(faucetLevel:number):BonusSetting{
    if(faucetLevel>11) faucetLevel = 11;
    return faucetAchieveLevelBonus.filter(bonus=>bonus.level===faucetLevel)[0].autofaucetBonus;
  }

  getAutofaucetLevelBonus(faucetLevel:number):BonusSetting{
    if(faucetLevel>11) faucetLevel = 11;
    return faucetLevelBonus.filter(bonus=>bonus.level===faucetLevel)[0].autofaucetBonus;
  }

  getRefAutoFaucetAchieveLevelBonus():BonusSetting{
    return refFaucetAchieveLevelBonus.autofaucetBonus;
  }


}