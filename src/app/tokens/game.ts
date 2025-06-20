import { InjectionToken } from '@angular/core';
import { Game } from '../types/game';

export const GAME = new InjectionToken<Game>('GAME');
