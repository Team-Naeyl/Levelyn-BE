

export class BattleCreatedEvent  {
   constructor(
       public readonly userId: number,
       public readonly battleId: string
   ) {}
}