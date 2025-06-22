import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GameEvents } from '../types/game-events';

@Injectable({ providedIn: 'root' })
export class GameEventsService implements GameEvents {
  public readonly start$ = new Subject<number>();
  public readonly stop$ = new Subject<void>();
}
