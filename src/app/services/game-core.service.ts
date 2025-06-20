import { inject, Injectable } from '@angular/core';
import { PlayerControlService } from './player-control.service';
import { FrameService } from './frame.service';
import { share, withLatestFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameCore {
  private readonly _playerControl = inject(PlayerControlService);
  private readonly _frameService = inject(FrameService);

  public readonly gameTick$ = this._frameService.frame$.pipe(
    withLatestFrom(this._playerControl.arrowKeysState$),
    share()
  );
}
