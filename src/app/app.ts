import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GAME } from './tokens/game';
import { toSignal } from '@angular/core/rxjs-interop';
import { GameData } from './types/game-data';
import { GAME_CONTROL } from './tokens/game-control';
import { Scene } from './components/scene/scene';
import { Options } from './components/options/options';
import { GameStateService } from './services/game-state.service';
import { GameState } from './types/game-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [Scene, Options],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  public readonly title = 'Rain Grabber';

  private readonly _game = inject(GAME);
  private readonly _gameControl = inject(GAME_CONTROL);
  private readonly _gameState = inject(GameStateService);

  public readonly game = toSignal<GameData | null>(this._game.data, {
    initialValue: null,
  });

  public readonly gameState = toSignal<GameState>(this._gameState.state$, {
    requireSync: true,
  });

  public startGame(value: number): void {
    this._gameControl.start(value);
  }

  public stopGame(): void {
    this._gameControl.stop();
  }

  public optionsChange(value: GameState): void {
    this._gameState.update(value);
  }
}
