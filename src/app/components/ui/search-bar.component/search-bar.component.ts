import { Component, input, model, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  pageName = input.required();
  protected showCloseBtn = signal(false);
  protected searchString = model<string | null>(null);

  protected onSearch() {
    if (this.searchString() !== null) {
      this.showCloseBtn.set(true);
    }
  }

  protected onClearSearch() {
    this.searchString.set(null);
    this.showCloseBtn.set(false);
    console.log('set', this.showCloseBtn());
  }
}
