import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameFallingState } from '../types/game-falling-state';

@Injectable({ providedIn: 'root' })
export class GameFallingStateService {
  private readonly _state = new BehaviorSubject<GameFallingState>({
    fallingTick: 1000,
  });

  public readonly state$ = this._state.asObservable();

  public update(value: Partial<GameFallingState>): void {
    const state = this._state.value;

    this._state.next({ ...state, ...value });
  }
}
