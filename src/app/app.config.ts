import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { GAME } from './tokens/game';
import { GAME_MOK } from './tokens/game-mok';
import { GAME_CONTROL } from './tokens/game-control';
import { GAME_CONTROL_MOK } from './tokens/game-control-mok';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    {
      provide: GAME,
      useExisting: GAME_MOK,
    },
    {
      provide: GAME_CONTROL,
      useExisting: GAME_CONTROL_MOK,
    },
  ],
};
