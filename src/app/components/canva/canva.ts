import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  linkedSignal,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Subscription, debounceTime, fromEvent } from 'rxjs';
import { GameCore } from '../../services/game-core.service';
import { GameStateService } from '../../services/game-state.service';
import { FallingItem } from './types/falling-item';
import { GamePlayer } from './types/player';
import { SceneSize } from './types/scene-size';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-canva',
  templateUrl: './canva.html',
  styleUrl: './canva.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Canva implements AfterViewInit, OnInit {
  private _ctx?: CanvasRenderingContext2D;

  private readonly _widowsResize$ = fromEvent(window, 'resize').pipe(
    debounceTime(200)
  );

  private readonly _gameCore = inject(GameCore);
  private readonly _gameState = inject(GameStateService);

  private readonly _subscription = new Subscription();

  private readonly _canvasRef =
    viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  private readonly _canvasWrapperRef =
    viewChild<ElementRef<HTMLElement>>('canvasWrapper');

  private readonly _sceneSize = signal<SceneSize>({ height: 0, width: 0 });
  private readonly _fallingItems = signal<FallingItem[]>([]);

  private readonly _gameStateSignal = toSignal(this._gameState.state$, {
    requireSync: true,
  });

  private readonly _player = linkedSignal<GamePlayer>(() => {
    const { playerHeight, playerSpeed, playerWidth } = this._gameStateSignal();

    return {
      x: 0,
      y: 0,
      width: playerWidth,
      height: playerHeight,
      speed: playerSpeed,
    };
  });

  public ngOnInit(): void {
    this._subscription.add(
      this._gameCore.gameTick$.subscribe({
        next: (tick) => {
          const [
            tickCounter,
            control,
            {
              fallenItemSpeed,
              fallenItemHeight,
              fallenItemWidth,
              fallingItemTick,
            },
          ] = tick;

          const sceneSize = this._sceneSize();

          let offset = 0;

          if (control.ArrowLeft) {
            offset = 1;
          }

          if (control.ArrowRight) {
            offset = -1;
          }

          if (offset !== 0) {
            this._player.update((state) => ({
              ...state,
              x: Math.max(
                0,
                Math.min(
                  state.x - offset * state.speed,
                  sceneSize.width - state.width
                )
              ),
            }));
          }

          if (tickCounter % fallingItemTick === 0) {
            this._fallingItems.update((state) => [
              ...state,
              {
                x: Math.random() * (sceneSize.width - fallenItemWidth),
                y: 0,
                width: fallenItemWidth,
                height: fallenItemHeight,
              },
            ]);
          }

          this._fallingItems().forEach((item) => {
            item.y += fallenItemSpeed;
          });

          this._fallingItems.update((state) =>
            state.filter((item) => {
              const player = this._player();

              const circleX = item.x + item.width / 2;
              const circleY = item.y + item.height / 2;
              const radius = item.width / 2;

              const rect = player;

              const distX = Math.abs(circleX - (rect.x + rect.width / 2));
              const distY = Math.abs(circleY - (rect.y + rect.height / 2));

              const hit =
                distX <= rect.width / 2 + radius &&
                distY <= rect.height / 2 + radius &&
                (distX <= rect.width / 2 ||
                  distY <= rect.height / 2 ||
                  Math.pow(distX - rect.width / 2, 2) +
                    Math.pow(distY - rect.height / 2, 2) <=
                    Math.pow(radius, 2));

              const missed = item.y - item.height > this._sceneSize().height;

              return !(hit || missed);
            })
          );

          this._draw();
        },
      })
    );
  }

  public ngAfterViewInit(): void {
    const canvas = this._canvasRef()?.nativeElement;
    const canvasWrapper = this._canvasWrapperRef()?.nativeElement;

    if (canvas !== undefined && canvasWrapper !== undefined) {
      this._ctx = canvas.getContext('2d')!;

      const { width, height } = canvasWrapper.getBoundingClientRect();

      canvas.width = width;
      canvas.height = height;

      this._player.update(
        (state): GamePlayer => ({
          ...state,
          x: width / 2 - state.width / 2,
          y: height - state.height - 10,
        })
      );

      this._sceneSize.set({ height, width });

      this._draw();

      this._subscription.add(
        this._widowsResize$.subscribe({
          next: () => {
            const { width, height } = canvasWrapper.getBoundingClientRect();

            canvas.width = width;
            canvas.height = height;

            this._sceneSize.set({
              height,
              width,
            });

            console.log(this._player());

            this._player.update((state) => ({
              ...state,
              x: width / 2 - state.width / 2,
              y: height - state.height - 10,
            }));

            this._fallingItems().forEach((item) => {
              item.x = Math.max(0, Math.min(item.x, width - item.width));
            });

            this._draw();
          },
        })
      );
    }
  }

  private _draw(): void {
    const ctx: CanvasRenderingContext2D | undefined = this._ctx;

    if (ctx !== undefined) {
      const { width, height } = this._sceneSize();

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = 'rgb(65 158 80)';

      ctx.fillRect(
        this._player().x,
        this._player().y,
        this._player().width,
        this._player().height
      );

      ctx.fillStyle = 'rgb(182, 223, 129)';

      this._fallingItems().forEach((item) => {
        ctx.beginPath();
        ctx.arc(
          item.x + item.width / 2,
          item.y + item.height / 2,
          item.width / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
