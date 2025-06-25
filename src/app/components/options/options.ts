import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OptionsControl } from './types/options-control';
import { FormControlErrorPipe } from '../../pipes/form-controls-error.pipe';
import { GameState } from '../../types/game-state';

@Component({
  selector: 'app-options',
  imports: [ReactiveFormsModule, FormControlErrorPipe],
  templateUrl: './options.html',
  styleUrl: './options.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Options implements OnInit {
  public readonly options = input.required<GameState>();
  public readonly inChangeOptions = output<GameState>();

  public readonly optionGroup = new FormGroup<OptionsControl<GameState>>({
    playerSpeed: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.1)],
    }),
    playerHeight: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(5), Validators.max(50)],
    }),
    playerWidth: new FormControl(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(10),
        Validators.max(300),
      ],
    }),
    fallenItemSpeed: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.1)],
    }),
    fallenItemHeight: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(10), Validators.max(50)],
    }),
    fallenItemWidth: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(10), Validators.max(50)],
    }),
    fallingFrequency: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    gameTime: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(60)],
    }),
  });

  public ngOnInit(): void {
    const {
      fallenItemHeight,
      fallenItemWidth,
      fallenItemSpeed,
      fallingFrequency: fallingItemTick,
      playerHeight,
      playerSpeed,
      playerWidth,
      gameTime,
    } = this.options();

    this.optionGroup.patchValue(
      {
        fallenItemHeight,
        fallenItemWidth,
        fallenItemSpeed,
        fallingFrequency: fallingItemTick,
        playerHeight,
        playerSpeed,
        playerWidth,
        gameTime,
      },
      { emitEvent: false }
    );

    this.optionGroup.valueChanges.subscribe(() => {
      if (!this.optionGroup.valid) {
        return;
      }

      this.inChangeOptions.emit(this.optionGroup.value as GameState);
    });
  }
}
