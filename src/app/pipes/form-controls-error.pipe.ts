import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';

@Pipe({
  name: 'fromControlError',
})
export class FormControlErrorPipe implements PipeTransform {
  public transform(
    controlErrors: FormControl['errors'],
    defValue: string
  ): string {
    let errorMessage: string = defValue;

    if (controlErrors !== null) {
      if (controlErrors['min']) {
        errorMessage = `Min value is ${controlErrors['min'].min}`;
      }

      if (controlErrors['max']) {
        errorMessage = `Max value is ${controlErrors['max'].max}`;
      }

      if (controlErrors['required']) {
        errorMessage = 'Value is Required';
      }
    }

    return errorMessage;
  }
}
