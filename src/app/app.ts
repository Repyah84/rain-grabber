import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { GAME } from './tokens/game';
import { toSignal } from '@angular/core/rxjs-interop';
import { GameData } from './types/game-data';
import { GAME_CONTROL } from './tokens/game-control';
import { Scene } from './components/scene/scene';
import { Options } from './components/options/options';
import { GameStateService } from './services/game-state.service';
import { GameState } from './types/game-state';
import { Game } from './components/game/game';
import { GameType } from './types/game-type';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [Scene, Options, Game],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements AfterViewInit {
  public readonly title = 'Rain Grabber';

  private readonly _gameService = inject(GAME);
  private readonly _gameControlService = inject(GAME_CONTROL);
  private readonly _gameStateService = inject(GameStateService);

  public readonly gameType = signal<GameType>(
    this._gameControlService.getGame().type
  );

  public readonly gameData = toSignal<GameData | null>(this._gameService.data, {
    initialValue: null,
  });

  public readonly gameState = toSignal<GameState>(
    this._gameStateService.state$,
    {
      requireSync: true,
    }
  );

  public readonly game = computed<GameData>(() => {
    return this.gameData() ?? this._gameControlService.getGame();
  });

  public ngAfterViewInit(): void {
    const { type, timeRemaining } = this._gameControlService.getGame();

    if (timeRemaining === 0) {
      return;
    }

    if (type === GameType.RUN || type === GameType.CONTINUE) {
      this._gameControlService.continue();
    }
  }

  public startGame(value: number): void {
    this._gameControlService.start(value);
  }

  public handleGame(): void {
    const game = this._gameControlService.getGame();

    if (game.type === GameType.CONTINUE || game.type === GameType.RUN) {
      this._gameControlService.pause();
    } else {
      this._gameControlService.continue();
    }

    this.gameType.set(this._gameControlService.getGame().type);
  }

  public optionsChange(data: GameState): void {
    const gameTime = this.gameState().gameTime;

    this._gameStateService.update(data);

    if (gameTime !== data.gameTime) {
      this.startGame(data.gameTime);
    }
  }
}
