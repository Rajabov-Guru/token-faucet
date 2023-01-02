import { BonusDependLevel } from '../models/BonusDependLevel';
import { HandfaucetBonus } from '../models/HandfaucetBonus';
import { AutofaucetBonus } from '../models/AutofaucetBonus';

export const getDailyBonus = (level:number)=>{
  if(level>7){
    return userDailyBonus.filter(bonus=>bonus.level===7)[0];
  }
  else return userDailyBonus.filter(bonus=>bonus.level===level)[0];
}

/*
Бонус за использование ежедневного бонуса в токенах (страница «Ежедневный бонус»)
 */
export const userDailyBonus:BonusDependLevel[] = [
  new BonusDependLevel(
    0,
    new HandfaucetBonus(0.1,1),
    new AutofaucetBonus(0.3,1)),
  new BonusDependLevel(
    1,
    new HandfaucetBonus(0.2,1),
    new AutofaucetBonus(0.4,1)),
  new BonusDependLevel(
    2,
    new HandfaucetBonus(0.3,1),
    new AutofaucetBonus(0.5,1)),
  new BonusDependLevel(
    3,
    new HandfaucetBonus(0.4,1),
    new AutofaucetBonus(0.6,1)),
  new BonusDependLevel(
    4,
    new HandfaucetBonus(0.5,1),
    new AutofaucetBonus(0.7,1)),
  new BonusDependLevel(
    5,
    new HandfaucetBonus(0.6,1),
    new AutofaucetBonus(0.8,1)),
  new BonusDependLevel(
    6,
    new HandfaucetBonus(0.7,1),
    new AutofaucetBonus(0.9,1)),
  new BonusDependLevel(
    7,
    new HandfaucetBonus(0.8,1),
    new AutofaucetBonus(1,1)),

]