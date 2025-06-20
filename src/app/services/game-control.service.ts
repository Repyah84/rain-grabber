import { inject, Injectable } from '@angular/core';
import { GameControl } from '../types/game-control';
import { GameData } from '../types/game-data';
import { GAME_STORAGE } from '../tokens/game-storage';
import { GAME_EVENTS } from '../tokens/game-events';

@Injectable({ providedIn: 'root' })
export class GameControlService implements GameControl {
  private readonly _gameStorage = inject(GAME_STORAGE);
  private readonly _gameEvents = inject(GAME_EVENTS);

  public start(value: number): void {
    this._gameEvents.start$.next(value);
  }

  public stop(): void {
    this._gameEvents.stop$.next();
  }

  public update(value: Partial<GameData>): void {
    this._gameStorage.update(value);
  }
}
