import { BonusDependLevel } from '../models/BonusDependLevel';
import { HandfaucetBonus } from '../models/HandfaucetBonus';
import { AutofaucetBonus } from '../models/AutofaucetBonus';

export const getAchieveFaucetLevelBonus = (level:number) => {
  if(level>11) return null;
  return faucetAchieveLevelBonus.filter(bonus=>bonus.level===level)[0];
}

/*
  Бонус  за достижение самим юзером уровня крана
*/
export const faucetAchieveLevelBonus:BonusDependLevel[]=[
  new BonusDependLevel(
    1,
    new HandfaucetBonus(0,0),
    new AutofaucetBonus(0,0)),

  new BonusDependLevel(
    2,
    new HandfaucetBonus(2,6),
    new AutofaucetBonus(5,10)),

  new BonusDependLevel(
    3,
    new HandfaucetBonus(3,7),
    new AutofaucetBonus(10,20)),

  new BonusDependLevel(
    4,
    new HandfaucetBonus(4,8),
    new AutofaucetBonus(15,30)),

  new BonusDependLevel(
    5,
    new HandfaucetBonus(5,9),
    new AutofaucetBonus(20,40)),

  new BonusDependLevel(
    6,
    new HandfaucetBonus(6,10),
    new AutofaucetBonus(25,50)),

  new BonusDependLevel(
    7,
    new HandfaucetBonus(7,11),
    new AutofaucetBonus(30,60)),

  new BonusDependLevel(
    8,
    new HandfaucetBonus(8,12),
    new AutofaucetBonus(35,70)),

  new BonusDependLevel(
    9,
    new HandfaucetBonus(9,13),
    new AutofaucetBonus(40,80)),

  new BonusDependLevel(
    10,
    new HandfaucetBonus(10,15),
    new AutofaucetBonus(45,90)),

  new BonusDependLevel(
    11,
    new HandfaucetBonus(12,20),
    new AutofaucetBonus(50,100)),
]