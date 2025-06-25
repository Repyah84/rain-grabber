import { GameData } from './game-data';

export interface GameControl {
  readonly start: (value: number) => void;
  readonly stop: () => void;
  readonly update: (value: Partial<GameData>) => void;
  readonly hit: () => void;
  readonly resetHits: () => void;
  readonly getGame: () => GameData;
  readonly pause: () => void;
  readonly continue: () => void;
}
