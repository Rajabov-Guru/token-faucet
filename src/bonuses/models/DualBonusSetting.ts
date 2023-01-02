import { HandfaucetBonus } from './HandfaucetBonus';
import { AutofaucetBonus } from './AutofaucetBonus';

export class DualBonusSetting {
  handfaucetBonus:HandfaucetBonus;
  autofaucetBonus:AutofaucetBonus;

  constructor(handfaucetBonus:HandfaucetBonus,
              autofaucetBonus:AutofaucetBonus) {
    this.handfaucetBonus = handfaucetBonus;
    this.autofaucetBonus = autofaucetBonus;
  }
}