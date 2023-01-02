import { Injectable } from '@nestjs/common';
import { faucetLevelBonus } from './items/faucet-level.bonus';
import { BonusSetting } from './models/BonusSetting';
import { userAchieveLevelBonus } from './items/user-achieve-level.bonus';
import { faucetAchieveLevelBonus } from './items/faucet-achieve-level.bonus';
import { userLoyaltyBonus } from './items/user-loyalty.bonus';
import { refAchieveLevelBonus } from './items/ref-achieve-level.bonus';
import { refFaucetAchieveLevelBonus } from './items/ref-faucet-achieve-level.bonus';
import { refLoyaltyBonus } from './items/ref-loyalty.bonus';

@Injectable()
export class BonusesService{

  getAllHandFaucetBonusesValue(faucetLevel:number){
      let result = 0;
  }

  getAllHandFaucetBonuses(faucetLevel:number):BonusSetting[]{
    const result:BonusSetting[] = [];
    result.push(this.getHandfaucetLevelBonus(faucetLevel));
    result.push(this.getHandFaucetAchieveLevelBonus(faucetLevel));
    result.push(this.getRefHandFaucetAchieveLevelBonus())
    return result;
  }

  getAllUserBonuses(userLevel:number):BonusSetting[]{
    const result:BonusSetting[] = [];
    result.push(this.getUserAchieveLevelBonus(userLevel));
    result.push(this.getUserLoyaltyBonus());
    result.push(this.getRefAchieveLevelBonus(userLevel));
    result.push(this.getRefLoyaltyBonus());
    return result;
  }

  getUserAchieveLevelBonus(userLevel:number):BonusSetting{
    const bonus = userAchieveLevelBonus;
    bonus.value *= userLevel;
    return bonus;
  }

  getUserLoyaltyBonus():BonusSetting{
    return userLoyaltyBonus;
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