import { Observable } from 'rxjs';
import { GameData } from './game-data';

export interface Game {
  readonly data: Observable<GameData | null>;
}
