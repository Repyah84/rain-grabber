import { inject, InjectionToken } from '@angular/core';
import { GameControl } from '../types/game-control';
import { GameControlService } from '../services/game-control.service';

export const GAME_CONTROL_MOK = new InjectionToken<GameControl>(
  'GAME_CONTROL_MOK',
  { providedIn: 'root', factory: () => inject(GameControlService) }
);
