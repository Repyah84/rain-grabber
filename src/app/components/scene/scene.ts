import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { GameCore } from '../../services/game-core.service';
import { GameStateService } from '../../services/game-state.service';
import { FallingItem } from './types/falling-item';
import { GamePlayer } from './types/player';
import { SceneSize } from './types/scene-size';

const FALLING_ITEM_COLOR = '#419E50';
const PLAYER_COLOR = '#B6DF81';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.html',
  styleUrl: './scene.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Scene implements OnInit, AfterViewInit, OnDestroy {
  private readonly _gameCore = inject(GameCore);
  private readonly _gameState = inject(GameStateService);

  private readonly _canvasRef =
    viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  private readonly _canvasWrapperRef =
    viewChild<ElementRef<HTMLElement>>('canvasWrapper');

  private readonly _subscription = new Subscription();

  private readonly _fallingItems: FallingItem[] = [];

  private _ctx?: CanvasRenderingContext2D;

  private _player: GamePlayer = {
    width: 0,
    height: 0,
    speed: 0,
    x: 0,
    y: 0,
  };

  private _sceneSize: SceneSize = { height: 0, width: 0 };

  private readonly _widowsResize$ = fromEvent(window, 'resize').pipe(
    debounceTime(200)
  );

  public ngOnInit(): void {
    this._subscription.add(
      this._gameState.state$.subscribe({
        next: (gameState) => {
          const { playerHeight, playerSpeed, playerWidth } = gameState;

          /**
           * Update player position after game config change
           */
          this._playerUpdate(() => ({
            height: playerHeight,
            width: playerWidth,
            speed: playerSpeed,
          }));
        },
      })
    );

    this._subscription.add(
      this._widowsResize$.subscribe(() => {
        const canvas = this._canvasRef()?.nativeElement;
        const canvasWrapper = this._canvasWrapperRef()?.nativeElement;

        if (canvas !== undefined && canvasWrapper !== undefined) {
          const { width, height } = canvasWrapper.getBoundingClientRect();

          canvas.width = width;
          canvas.height = height;

          /**
           * Update scene size after window resize
           */
          this._sceneSize = {
            height,
            width,
          };

          /**
           * Update player position after window resize
           */
          this._playerUpdate((player) => ({
            x: width / 2 - player.width / 2,
            y: height - player.height - 10,
          }));

          /**
           * Update falling items position after window resize
           */
          this._fallingItems.forEach((item) => {
            item.x = Math.max(
              0,
              Math.min(
                ((width - item.width) * item.xPr) / 100,
                width - item.width
              )
            );

            item.y = (height * item.yPr) / 100;
          });

          this._draw();
        }
      })
    );

    this._subscription.add();
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

        const sceneSize = this._sceneSize;
        const player = this._player;

        let offset = 0;

        if (control.ArrowLeft) {
          offset = 1;
        }

        if (control.ArrowRight) {
          offset = -1;
        }

        /**
         * Update player position after keyBoard events
         * ArrowLeft keyBoardDown keyBoardUp
         * ArrowRight keyBoardDown keyBoardUp
         */
        if (offset !== 0) {
          this._playerUpdate((player) => ({
            x: Math.max(
              0,
              Math.min(
                player.x - offset * player.speed,
                sceneSize.width - player.width
              )
            ),
          }));
        }

        /**
         * Add falling item
         */
        if (tickCounter === 1 || tickCounter % fallingItemTick === 0) {
          const xPr = Math.floor(Math.random() * 101);

          this._fallingItems.push({
            x: ((sceneSize.width - fallenItemWidth) * xPr) / 100,
            xPr,
            y: 0,
            yPr: 0,
            width: fallenItemWidth,
            height: fallenItemHeight,
          });
        }

        /**
         * Move falling item
         */
        this._fallingItems.forEach((item) => {
          item.yPr += 0.1 * fallenItemSpeed;

          item.y = (sceneSize.height * item.yPr) / 100;
        });

        /**
         * Remove falling item
         */
        for (let i = this._fallingItems.length - 1; i >= 0; i--) {
          const item = this._fallingItems[i];

          const circleX = item.x + item.width / 2;
          const circleY = item.y + item.height / 2;
          const radius = item.width / 2;

          const playerCenterX = player.x + player.width / 2;
          const playerCenterY = player.y + player.height / 2;

          const distX = Math.abs(circleX - playerCenterX);
          const distY = Math.abs(circleY - playerCenterY);

          const collisionOnX = distX <= player.width / 2 + radius;
          const collisionOnY = distY <= player.height / 2 + radius;

          const cornerCheck =
            distX > player.width / 2 &&
            distY > player.height / 2 &&
            Math.pow(distX - player.width / 2, 2) +
              Math.pow(distY - player.height / 2, 2) <=
              Math.pow(radius, 2);

          const isHit =
            collisionOnX &&
            collisionOnY &&
            (distX <= player.width / 2 ||
              distY <= player.height / 2 ||
              cornerCheck);

          const isMissed = item.y - item.height > sceneSize.height;

          if (isHit || isMissed) {
            this._fallingItems.splice(i, 1);
          }
        }

        this._draw();
      },
    });
  }

  public ngAfterViewInit(): void {
    const canvas = this._canvasRef()?.nativeElement;
    const canvasWrapper = this._canvasWrapperRef()?.nativeElement;

    if (canvas !== undefined && canvasWrapper !== undefined) {
      this._ctx = canvas.getContext('2d')!;

      const { width, height } = canvasWrapper.getBoundingClientRect();

      canvas.width = width;
      canvas.height = height;

      /**
       * Update player position after vew init
       */
      this._playerUpdate((player) => ({
        x: width / 2 - player.width / 2,
        y: height - player.height - 10,
      }));

      this._sceneSize = { height, width };

      this._draw();
    }
  }

  private _playerUpdate(fn: (value: GamePlayer) => Partial<GamePlayer>): void {
    const player = this._player;

    this._player = { ...player, ...fn(player) };
  }

  private _draw(): void {
    const ctx: CanvasRenderingContext2D | undefined = this._ctx;

    if (ctx !== undefined) {
      const { width, height } = this._sceneSize;

      const player = this._player;

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = FALLING_ITEM_COLOR;

      ctx.fillRect(player.x, player.y, player.width, player.height);

      ctx.fillStyle = PLAYER_COLOR;

      this._fallingItems.forEach((item) => {
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

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
