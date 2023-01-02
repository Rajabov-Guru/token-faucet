export class FaucetEvent {
  userId:number;
  faucetId:number;

  constructor(userId:number, faucetId:number) {
    this.userId = userId;
    this.faucetId = faucetId;
  }
}