import {
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  linkedSignal,
} from '@angular/core';

@Directive({
  selector: '[gameFallingControl]',
  exportAs: 'gameFallingControl',
  host: {
    '[style.--falling-offset-y.%]': 'offsetYValue()',
    '[style.--falling-offset-x.%]': 'offsetXValue()',
  },
})
export class FallingControlDirective {
  public readonly element: ElementRef<HTMLElement> = inject(ElementRef);

  public readonly id = input.required<number>({ alias: 'gameFallingControl' });
  public readonly offsetY = input.required<number>();
  public readonly offsetX = input.required<number>();

  public readonly offsetYValue = linkedSignal(() => this.offsetY());
  public readonly offsetXValue = linkedSignal(() => this.offsetX());
}
