import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPreventLeadingSpace]'
})
export class PreventLeadingSpaceDirective {

  constructor(private ngControl: NgControl) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    if (value.startsWith(' ')) {
      this.ngControl.control?.setValue(value.trim(), { emitEvent: false });
    }
  }
}
