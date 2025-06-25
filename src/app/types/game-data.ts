import { GameType } from './game-type';

export interface GameData {
  readonly caughtObjects: number;
  readonly timeRemaining: number;
  readonly type: GameType;
}
