import {
  Component,
  contentChild,
  effect,
  inject,
  signal,
  TemplateRef,
  viewChild,
  viewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';

import { PlyerTemplateDirective } from '../../directives/player-template.directive';
import { GameCore } from '../../services/game-core.service';

import { FallingItem } from '../../types/falling-item';
import { GameStateService } from '../../services/game-state.service';
import { PlayerControlDirective } from '../../directives/player-control.directive';
import { FallingControlDirective } from '../../directives/falling-control.directive';
import { FallingTemplateDirective } from '../../directives/falling-template.directive';

@Component({
  selector: 'app-scene',
  imports: [NgTemplateOutlet, PlayerControlDirective, FallingControlDirective],
  templateUrl: './scene.html',
  styleUrl: './scene.scss',
  host: {
    '[style.--scene-x-board-end.px]': 'gameState().playerWidth',
    '[style.--scene-x-board-start.px]': 'gameState().fallenItemWidth',
    '[style.--scene-y-board.px]': 'gameState().fallenItemHeight',
    '[style.--player-height.px]': 'gameState().playerHeight',
    '[style.--player-width.px]': 'gameState().playerWidth',
    '[style.--falling-width.px]': 'gameState().fallenItemWidth',
    '[style.--falling-height.px]': 'gameState().fallenItemHeight',
  },
})
export class Scene {
  private readonly _gameCore = inject(GameCore);
  private readonly _gameState = inject(GameStateService);

  public readonly playerTemplate = contentChild(PlyerTemplateDirective, {
    read: TemplateRef,
  });

  public readonly fallingTemplate = contentChild(FallingTemplateDirective, {
    read: TemplateRef,
  });

  public readonly player = viewChild(PlayerControlDirective);

  public readonly fallingItems = viewChildren(FallingControlDirective);

  public readonly gameState = toSignal(this._gameState.state$, {
    requireSync: true,
  });

  public readonly gameTick = toSignal(this._gameCore.gameTick$, {
    initialValue: null,
  });

  public readonly fallingCore = toSignal<FallingItem[] | null>(
    this._gameCore.gameFalling$,
    { initialValue: null }
  );

  public readonly cath = signal<number>(0);

  public constructor() {
    effect(() => {
      const tick = this.gameTick();
      const player = this.player();

      if (tick !== null && player !== undefined) {
        const [
          _timeStep,
          control,
          { playerSpeed, fallenItemSpeed, playerWidth },
        ] = tick;

        let offset = 0;

        if (control.ArrowLeft) {
          offset = -1;
        }

        if (control.ArrowRight) {
          offset = 1;
        }

        if (offset !== 0) {
          player.offSetX.update((currentOffset): number => {
            if (
              (offset === 1 && currentOffset === 100) ||
              (offset === -1 && currentOffset === 0)
            ) {
              return currentOffset;
            }

            return currentOffset + offset * playerSpeed;
          });
        }

        this.fallingItems().forEach((item) => {
          const playerRect =
            player.elementRef.nativeElement.getBoundingClientRect();

          const itemRect = item.element.nativeElement.getBoundingClientRect();

          if (
            playerRect.top - itemRect.bottom < 0 &&
            itemRect.right - playerRect.left > 0 &&
            itemRect.right - playerRect.left < playerWidth
          ) {
            this.cath.update((state) => state + 1);

            this._gameCore.deleteFallingItem(item.id());

            return;
          }

          if (playerRect.top - itemRect.bottom < 0) {
            this._gameCore.deleteFallingItem(item.id());

            return;
          }

          item.offsetYValue.update(
            (currentOffset) => currentOffset + 1 * fallenItemSpeed
          );
        });
      }
    });
  }
}
