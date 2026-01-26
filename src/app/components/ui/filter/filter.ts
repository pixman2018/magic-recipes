import { Component } from '@angular/core';
// data
import recipiesCategories from '../../../../../data/recipiesCategories.json';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class FilterComponent {
  protected recipiesCategories: string[] = recipiesCategories;

  protected onChangeCategory(category: any) {
    console.log(category);
  }
}
