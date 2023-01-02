import { HandfaucetBonus } from './HandfaucetBonus';
import { AutofaucetBonus } from './AutofaucetBonus';

export class BonusDependLevel{
  level:number;
  handfaucetBonus:HandfaucetBonus;
  autofaucetBonus:AutofaucetBonus;

  constructor(
    level:number,
    handfaucetBonus:HandfaucetBonus,
    autofaucetBonus:AutofaucetBonus
  ) {
    this.level = level;
    this.handfaucetBonus = handfaucetBonus;
    this.autofaucetBonus = autofaucetBonus;
  }
}