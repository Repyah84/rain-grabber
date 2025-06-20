import { inject, InjectionToken } from '@angular/core';
import { Game } from '../types/game';
import { GameMockService } from '../services/game-mok.service';

export const GAME_MOK = new InjectionToken<Game>('GAME_MOK', {
  providedIn: 'root',
  factory: () => inject(GameMockService),
});
