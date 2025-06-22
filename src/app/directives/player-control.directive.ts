import { computed, Directive, ElementRef, inject, signal } from '@angular/core';

@Directive({
  selector: '[gamePlayerControl]',
  exportAs: 'gamePlayerControl',
  host: {
    '[style.--player-offset-x.%]': 'offSetX()',
  },
})
export class PlayerControlDirective {
  public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  public readonly offSetX = signal<number>(0);
}
