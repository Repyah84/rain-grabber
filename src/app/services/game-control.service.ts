import { inject, Injectable } from '@angular/core';
import { GameControl } from '../types/game-control';
import { GameData } from '../types/game-data';
import { GAME_STORAGE } from '../tokens/game-storage';
import { GAME_EVENTS } from '../tokens/game-events';
import { GameType } from '../types/game-type';

@Injectable({ providedIn: 'root' })
export class GameControlService implements GameControl {
  private readonly _gameStorage = inject(GAME_STORAGE);
  private readonly _gameEvents = inject(GAME_EVENTS);

  public start(value: number): void {
    this._gameStorage.update({
      type: GameType.RUN,
    });

    this._gameEvents.start$.next(value);
  }

  public stop(): void {
    this._gameStorage.update({
      type: GameType.FINISH,
    });

    this._gameEvents.stop$.next();
  }

  public pause(): void {
    this._gameStorage.update({
      type: GameType.PAUSE,
    });

    this._gameEvents.stop$.next();
  }

  public continue(): void {
    this._gameStorage.update({
      type: GameType.CONTINUE,
    });

    this._gameEvents.start$.next(this.getGame().timeRemaining);
  }

  public update(value: Partial<GameData>): void {
    this._gameStorage.update(value);
  }

  public hit(): void {
    const currentHit = this.getGame().caughtObjects;

    this._gameStorage.update({
      caughtObjects: currentHit + 1,
    });
  }

  public resetHits(): void {
    this._gameStorage.update({
      caughtObjects: 0,
    });
  }

  public getGame(): GameData {
    return (
      this._gameStorage.get() ?? {
        caughtObjects: 0,
        timeRemaining: 0,
        type: GameType.FINISH,
      }
    );
  }
}
