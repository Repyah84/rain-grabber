import { Component, input } from '@angular/core';

const offSetXTransform = (value: number | undefined): string => {
  if (value === undefined || value < 0) {
    return '0%';
  }

  if (value > 100) {
    return '100%';
  }

  return `${value}%`;
};

@Component({
  selector: 'app-player',
  imports: [],
  templateUrl: './player.html',
  styleUrl: './player.scss',
  host: {
    '[style.--player-off-set-x]': 'offSetX()',
    '[style.--player-height]': 'height()',
    '[style.--player-width]': 'width()',
  },
})
export class Player {
  public readonly offSetX = input(undefined, { transform: offSetXTransform });
  public readonly width = input<string>();
  public readonly height = input<string>();
}
