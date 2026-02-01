import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'lib-dropdown-checkbox',
  imports: [],
  templateUrl: './dropdown-checkbox.html',
  styles: [
    `
      @import '../../../theme/_form';
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownCheckbox implements FormValueControl<string[]> {
  title = input.required();
  items = input.required<string[]>();
  isRequired = input<boolean>(false);
  public value = model<string[]>([]);
  protected showDropdown = signal<boolean>(false);

  protected toggleItems(item: string): void {
    const current = this.value();
    if (current.includes(item)) {
      this.value.set(current.filter((v) => v !== item));
    } else {
      this.value.set([...current, item]);
    }
  }

  protected onShowDropdown() {
    this.showDropdown.set(!this.showDropdown());
  }
}
