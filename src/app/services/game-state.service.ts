import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameState } from '../types/game-state';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  public readonly state$ = new BehaviorSubject<GameState>({
    playerSpeed: 10,
    playerHeight: 25,
    playerWidth: 150,
    fallenItemSpeed: 1,
    fallenItemHeight: 30,
    fallenItemWidth: 30,
    fallingFrequency: 60,
    gameTime: 180,
  });

  public update(value: Partial<GameState>): void {
    const state = this.state$.value;

    this.state$.next({ ...state, ...value });
  }
}
