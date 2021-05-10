import { FormArray, FormControl, FormGroup } from '@angular/forms';

export function markAsUntouched(group: FormGroup | FormArray): void {
  group.markAsUntouched();

  Object.keys(group.controls).map((field) => {
    const control = group.get(field);
    if (control instanceof FormControl) {
      control.markAsUntouched();
    } else if (control instanceof FormGroup) {
      markAsUntouched(control);
    }
  });
}
