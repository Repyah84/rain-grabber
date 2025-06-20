import { Directive, inject, signal, TemplateRef } from '@angular/core';

@Directive({
  selector: '[gamePlayer]',
  standalone: true,
})
export class PlyerDirective {
  public readonly template = inject(TemplateRef);

  public readonly offSetX = signal<number | undefined>(undefined);
  public readonly width = signal<string | undefined>(undefined);
  public readonly height = signal<string | undefined>(undefined);
}
