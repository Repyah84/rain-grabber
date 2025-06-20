import { inject, Injectable } from '@angular/core';
import { animationFrames, share, switchMap, takeUntil } from 'rxjs';
import { GAME_EVENTS } from '../tokens/game-events';

@Injectable({ providedIn: 'root' })
export class FrameService {
  private readonly _gameEvents = inject(GAME_EVENTS);

  public frame$ = this._gameEvents.start$.pipe(
    switchMap(() =>
      animationFrames().pipe(takeUntil(this._gameEvents.stop$), share())
    )
  );
}
