import { Subject } from 'rxjs';

export interface GameEvents {
  readonly start$: Subject<number>;
  readonly stop$: Subject<void>;
}
