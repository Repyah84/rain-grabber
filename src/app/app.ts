import { Component, effect, inject } from '@angular/core';
import { GAME } from './tokens/game';
import { toSignal } from '@angular/core/rxjs-interop';
import { GameData } from './types/game-data';
import { GAME_CONTROL } from './tokens/game-control';
import { PlayerControlService as PlayerControlService } from './services/player-control.service';
import { GameKeyState } from './types/game-keys-state';
import { GameCore } from './services/game-core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly _game = inject(GAME);
  private readonly _gameControl = inject(GAME_CONTROL);
  private readonly _gameCore = inject(GameCore);

  public readonly title = 'Rain Grabber';

  public readonly game = toSignal<GameData | null>(this._game.data, {
    initialValue: null,
  });

  public readonly playerControl = toSignal(this._gameCore.gameTick$, {
    initialValue: null,
  });

  public constructor() {
    effect(() => {
      console.log(this.playerControl());
    });
  }

  public startGame(value: number): void {
    this._gameControl.start(value);
  }

  public stopGame(): void {
    this._gameControl.stop();
  }
}
