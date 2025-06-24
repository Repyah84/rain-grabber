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
import { GameState } from '../../types/game-state';
import { OptionsControl } from './types/options-control';
import { FormControlErrorPipe } from '../../pipes/form-controls-error.pipe';

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
    fallingItemTick: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  public ngOnInit(): void {
    const {
      fallenItemHeight,
      fallenItemWidth,
      fallenItemSpeed,
      fallingItemTick,
      playerHeight,
      playerSpeed,
      playerWidth,
    } = this.options();

    this.optionGroup.patchValue(
      {
        fallenItemHeight,
        fallenItemWidth,
        fallenItemSpeed,
        fallingItemTick,
        playerHeight,
        playerSpeed,
        playerWidth,
      },
      { emitEvent: false }
    );

    this.optionGroup.valueChanges.subscribe((v) => {
      console.log(v, this.optionGroup);
    });
  }

  public onSubmit(event: Event): void {
    console.log(this.optionGroup, event);

    if (!this.optionGroup.valid) {
      return;
    }

    this.inChangeOptions.emit(this.optionGroup.value as GameState);
  }
}
