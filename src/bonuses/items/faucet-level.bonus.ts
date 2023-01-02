import { BonusDependLevel } from '../models/BonusDependLevel';
import { HandfaucetBonus } from '../models/HandfaucetBonus';
import { AutofaucetBonus } from '../models/AutofaucetBonus';

export const getLevelBonus = (level:number) => {
  if(level>11) return null;
  return faucetLevelBonus.filter(bonus=>bonus.level===level)[0];
}
/*
  Бонус уровня крана
*/
export const faucetLevelBonus:BonusDependLevel[] = [
  new BonusDependLevel(
    1,
    new HandfaucetBonus(0,0),
    new AutofaucetBonus(0,0)),

  new BonusDependLevel(
    2,
    new HandfaucetBonus(10,0),
    new AutofaucetBonus(15,0)),

  new BonusDependLevel(
    3,
    new HandfaucetBonus(20,0),
    new AutofaucetBonus(25,0)),

  new BonusDependLevel(
    4,
    new HandfaucetBonus(30,0),
    new AutofaucetBonus(35,0)),

  new BonusDependLevel(
    5,
    new HandfaucetBonus(40,0),
    new AutofaucetBonus(45,0)),

  new BonusDependLevel(
    6,
    new HandfaucetBonus(50,0),
    new AutofaucetBonus(55,0)),

  new BonusDependLevel(
    7,
    new HandfaucetBonus(60,0),
    new AutofaucetBonus(65,0)),

  new BonusDependLevel(
    8,
    new HandfaucetBonus(70,0),
    new AutofaucetBonus(75,0)),

  new BonusDependLevel(
    9,
    new HandfaucetBonus(85,0),
    new AutofaucetBonus(85,0)),

  new BonusDependLevel(
    10,
    new HandfaucetBonus(100,0),
    new AutofaucetBonus(105,0)),

  new BonusDependLevel(
    11,
    new HandfaucetBonus(110,0),
    new AutofaucetBonus(115,0)),
]