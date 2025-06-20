import { Injectable } from '@angular/core';
import {
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  scan,
  share,
  startWith,
} from 'rxjs';
import { GameKeyState } from '../types/game-keys-state';

@Injectable({ providedIn: 'root' })
export class PlayerControlService {
  private readonly _keyDown$ = fromEvent<KeyboardEvent>(window, 'keydown');
  private readonly _keyUp$ = fromEvent<KeyboardEvent>(window, 'keyup');

  public readonly arrowKeysState$: Observable<GameKeyState> = merge(
    this._keyDown$.pipe(
      filter((e) => e.key === 'ArrowLeft' || e.key === 'ArrowRight'),
      map((e) => ({ key: e.key, pressed: true }))
    ),
    this._keyUp$.pipe(
      filter((e) => e.key === 'ArrowLeft' || e.key === 'ArrowRight'),
      map((e) => ({ key: e.key, pressed: false }))
    )
  ).pipe(
    scan(
      (state, event) => ({
        ...state,
        [event.key]: event.pressed,
      }),
      { ArrowLeft: false, ArrowRight: false }
    ),
    startWith({ ArrowLeft: false, ArrowRight: false }),
    distinctUntilChanged(
      (prev, curr) =>
        prev.ArrowLeft === curr.ArrowLeft && prev.ArrowRight === curr.ArrowRight
    ),
    share()
  );
}
