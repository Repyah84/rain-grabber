import { inject, Injectable } from '@angular/core';
import { GAME_EVENTS } from '../tokens/game-events';
import { Observable, scan, Subject, switchMap } from 'rxjs';
import { FallingItem } from '../types/falling-item';

@Injectable({ providedIn: 'root' })
export class GameFallingService {
  private readonly _gameEvent = inject(GAME_EVENTS);

  public readonly toggleFallingItem$ = new Subject<number>();

  public readonly fallingItems$: Observable<FallingItem[]> =
    this._gameEvent.start$.pipe(
      switchMap(() =>
        this.toggleFallingItem$.pipe(
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
              id: v,
              x: -Math.floor(Math.random() * 101),
              y: -100,
            });

            return [...r];
          }, [])
        )
      )
    );
}
