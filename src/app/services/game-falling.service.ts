import { inject, Injectable } from '@angular/core';
import { GAME_EVENTS } from '../tokens/game-events';
import {
  merge,
  Observable,
  scan,
  Subject,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';
import { GameFallingStateService } from './game-falling-state.service';
import { FallingItem } from '../types/falling-item';

@Injectable({ providedIn: 'root' })
export class GameFallingService {
  private readonly _gameEvent = inject(GAME_EVENTS);
  private readonly _gameFallingState = inject(GameFallingStateService);

  public readonly deleteFallingItemEvent$ = new Subject<number>();

  public readonly fallingItems$: Observable<FallingItem[]> =
    this._gameEvent.start$.pipe(
      switchMap(() =>
        this._gameFallingState.state$.pipe(
          switchMap(({ fallingTick }) =>
            merge(
              timer(0, fallingTick).pipe(takeUntil(this._gameEvent.stop$)),
              this.deleteFallingItemEvent$
            )
          ),
          scan<number, FallingItem[]>((r, v) => {
            if (v < 0) {
              const index = r.findIndex(({ id }) => id === Math.abs(v));

              if (index === -1) {
                return r;
              }

              r.splice(index, 1);

              return [...r];
            }

            r.push({
              id: Math.floor(Math.random() * 1000000),
              x: -Math.floor(Math.random() * 101),
              y: -100,
            });

            return [...r];
          }, [])
        )
      )
    );
}
