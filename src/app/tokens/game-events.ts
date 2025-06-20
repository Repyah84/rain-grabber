import { inject, InjectionToken } from '@angular/core';
import { GameEvents } from '../types/game-events';
import { GameEventsService } from '../services/game-events.service';

export const GAME_EVENTS = new InjectionToken<GameEvents>('GAME_EVENTS', {
  providedIn: 'root',
  factory: () => inject(GameEventsService),
});
