import { Component, input } from '@angular/core';
import { GameData } from '../../types/game-data';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-game',
  templateUrl: './game.html',
  styleUrl: './game.scss',
  imports: [DatePipe],
})
export class Game {
  public readonly game = input.required<GameData>();
}
