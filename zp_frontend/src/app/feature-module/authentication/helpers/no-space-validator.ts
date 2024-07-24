import { AbstractControl, ValidationErrors } from "@angular/forms";

export function noSpacesValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value as string;
    if (value && value.trim().indexOf(' ') !== -1) {
      return { 'spaces': true }; // Return an error if the value contains spaces
    }
    return null; // Return null if validation succeeds
  }