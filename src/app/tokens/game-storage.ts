import { inject, InjectionToken } from '@angular/core';
import { GameStorage } from '../types/game-storage';
import { GameStorageService } from '../services/game-storage.service';

export const GAME_STORAGE = new InjectionToken<GameStorage>('GAME_STORAGE', {
  providedIn: 'root',
  factory: () => inject(GameStorageService),
});
