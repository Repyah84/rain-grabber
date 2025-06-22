import { inject, Injectable } from '@angular/core';
import { share, withLatestFrom } from 'rxjs';
import { PlayerControlService } from './player-control.service';
import { FrameService } from './frame.service';
import { GameFallingService } from './game-falling.service';
import { GameStateService } from './game-state.service';

@Injectable({ providedIn: 'root' })
export class GameCore {
  private readonly _playerControl = inject(PlayerControlService);
  private readonly _frameService = inject(FrameService);
  private readonly _gameFalling = inject(GameFallingService);
  private readonly _gameState = inject(GameStateService);

  public readonly gameTick$ = this._frameService.frame$.pipe(
    withLatestFrom(this._playerControl.arrowKeysState$, this._gameState.state$),
    share()
  );

  public readonly gameFalling$ = this._gameFalling.fallingItems$.pipe(share());

  public deleteFallingItem(id: number): void {
    this._gameFalling.deleteFallingItemEvent$.next(id * -1);
  }
}
