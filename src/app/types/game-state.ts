export interface GameState {
  readonly playerSpeed: number;
  readonly playerWidth: number;
  readonly playerHeight: number;
  readonly fallenItemSpeed: number;
  readonly fallenItemWidth: number;
  readonly fallenItemHeight: number;
  readonly fallingFrequency: number;
  readonly gameTime: number;
}
