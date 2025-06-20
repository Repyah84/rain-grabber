import { GameData } from './game-data';

export interface GameStorage {
  readonly key: string;
  readonly delete: () => void;
  readonly get: () => GameData | null;
  readonly add: (value: GameData) => void;
  readonly update: (value: Partial<GameData>) => GameData | null;
}
