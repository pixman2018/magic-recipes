import { Component, model } from '@angular/core';
import recipiesCategories from '../../../../../data/recipiesCategories.json';

import { FormsModule } from '@angular/forms';

interface I_Category {
  de: string;
  en: string;
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class FilterComponent {
  protected recipiesCategories: I_Category[] = recipiesCategories;
  protected selectedCategoryControl = model<string>('');

  protected onChangeCategory(category: any) {
    console.log(category.value);
  }
}
