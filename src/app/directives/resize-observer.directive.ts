import {
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { ResizeEventData } from '../types/resize-event-data';

@Directive({
  selector: '[appResizeObserver]',
})
export class ResizeObserverDirective implements OnInit, OnDestroy {
  private readonly _elementRef = inject(ElementRef);

  private readonly _observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;

      this.resize.emit({ width, height });
    }
  });

  public readonly resize = output<ResizeEventData>();

  public ngOnInit(): void {
    this._observer.observe(this._elementRef.nativeElement);
  }

  public ngOnDestroy(): void {
    this._observer.disconnect();
  }
}
