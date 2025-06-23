export interface GameState {
  readonly playerSpeed: number;
  readonly playerWidth: number;
  readonly playerHeight: number;
  readonly fallenItemSpeed: number;
  readonly fallenItemWidth: number;
  readonly fallenItemHeight: number;
  readonly fallingItemTick: number;
}
