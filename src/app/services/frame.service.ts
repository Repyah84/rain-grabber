import { inject, Injectable } from '@angular/core';
import { animationFrames, map, scan, switchMap, takeUntil } from 'rxjs';
import { GAME_EVENTS } from '../tokens/game-events';

@Injectable({ providedIn: 'root' })
export class FrameService {
  private readonly _gameEvents = inject(GAME_EVENTS);

  public frame$ = this._gameEvents.start$.pipe(
    switchMap(() =>
      animationFrames().pipe(
        map(() => 1),
        scan((r, v) => r + v, 0),
        takeUntil(this._gameEvents.stop$)
      )
    )
  );
}
