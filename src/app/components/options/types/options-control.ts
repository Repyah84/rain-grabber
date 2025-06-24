import { FormControl } from '@angular/forms';

export type OptionsControl<T> = {
  [K in keyof T]: FormControl<T[K]>;
};
