import { inject, Injectable } from '@angular/core';
import { Game } from '../types/game';
import {
  finalize,
  map,
  share,
  startWith,
  switchMap,
  takeUntil,
  takeWhile,
  timer,
} from 'rxjs';
import { GameData } from '../types/game-data';

import { GAME_STORAGE } from '../tokens/game-storage';
import { GAME_EVENTS } from '../tokens/game-events';

@Injectable({ providedIn: 'root' })
export class GameMockService implements Game {
  private readonly _gameStorage = inject(GAME_STORAGE);
  private readonly _gameEvents = inject(GAME_EVENTS);

  private readonly _countdownTimer$ = this._gameEvents.start$.pipe(
    switchMap((value) =>
      timer(0, 1000).pipe(
        takeWhile((n) => n <= value),
        takeUntil(this._gameEvents.stop$),
        finalize(() => this._gameEvents.stop$.next()),
        share()
      )
    )
  );

  public readonly data = this._countdownTimer$.pipe(
    map<number, GameData>((n) => {
      const data = this._gameStorage.get();

      let gameData: GameData;

      if (data === null) {
        gameData = {
          caughtObjects: 0,
          timeRemaining: n,
        };

        this._gameStorage.add(gameData);

        return gameData;
      }

      gameData = {
        ...data,
        timeRemaining: n,
      };

      this._gameStorage.update(gameData);

      return gameData;
    }),
    startWith(this._gameStorage.get())
  );
}
