import { Component, input, model, signal } from '@angular/core';

@Component({
  selector: 'lib-dropdown',
  imports: [],
  templateUrl: './dropdown.html',
  styles: [
    `
      @import '../../../theme/_form';
    `,
  ],
})
export class Dropdown {
  title = input.required();
  items = input.required<string[]>();
  id = input.required<string>();
  isRequired = input<boolean>(false);
  public value = model<string>('');

  protected showDropdown = signal<boolean>(false);

  protected setItems(item: string): void {
    this.value.set(item);
    console.log('item', item);
  }

  protected onShowDropdown() {
    this.showDropdown.set(!this.showDropdown());
  }
}
