import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-falling-unit',
  imports: [],
  templateUrl: './falling-unit.html',
  styleUrl: './falling-unit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FallingUnit {}
