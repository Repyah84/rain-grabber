import {
  Component,
  computed,
  contentChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import { PlyerDirective } from '../../directives/player.directive';
import { NgTemplateOutlet } from '@angular/common';
import { GameCore } from '../../services/game-core.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { GameState } from '../../types/game-state';

@Component({
  selector: 'app-scene',
  imports: [NgTemplateOutlet],
  templateUrl: './scene.html',
  styleUrl: './scene.scss',
})
export class Scene {
  private readonly _gameCore = inject(GameCore);

  public readonly player = contentChild(PlyerDirective);

  public readonly gameState = signal<GameState>({
    offset: 0,
  });

  public readonly playerControl = toSignal(this._gameCore.gameTick$, {
    initialValue: null,
  });

  public readonly context = computed(() => {
    const player = this.player();

    if (player === undefined) {
      return;
    }

    return {
      offsetX: player.offSetX(),
      width: player.width(),
      height: player.height(),
    };
  });

  public constructor() {
    effect(() => {
      const tick = this.playerControl();
      const player = this.player();

      if (tick !== null && player !== undefined) {
        let offset = 0;

        const [_timeStep, control] = tick;

        if (control.ArrowLeft) {
          offset = -1;
        }

        if (control.ArrowRight) {
          offset = 1;
        }

        if (offset !== 0) {
          this.gameState.update((state) => {
            if (
              (offset === 1 && state.offset === 100) ||
              (offset === -1 && state.offset === 0)
            ) {
              return state;
            }

            return {
              ...state,
              offset: state.offset + offset * 1,
            };
          });

          player.offSetX.set(this.gameState().offset);
        }
      }
    });

    effect(() => {
      console.log(this.gameState());
    });
  }
}
