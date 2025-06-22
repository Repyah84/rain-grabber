import { Component, inject } from '@angular/core';
import { GAME } from './tokens/game';
import { toSignal } from '@angular/core/rxjs-interop';
import { GameData } from './types/game-data';
import { GAME_CONTROL } from './tokens/game-control';
import { Scene } from './components/scene/scene';
import { PlyerTemplateDirective } from './directives/player-template.directive';
import { Player } from './components/player/player';
import { Falling } from './components/falling/falling';
import { FallingTemplateDirective } from './directives/falling-template.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    Scene,
    PlyerTemplateDirective,
    FallingTemplateDirective,
    Player,
    Falling,
  ],
})
export class App {
  public readonly title = 'Rain Grabber';

  private readonly _game = inject(GAME);
  private readonly _gameControl = inject(GAME_CONTROL);

  public readonly game = toSignal<GameData | null>(this._game.data, {
    initialValue: null,
  });

  public startGame(value: number): void {
    this._gameControl.start(value);
  }

  public stopGame(): void {
    this._gameControl.stop();
  }
}
