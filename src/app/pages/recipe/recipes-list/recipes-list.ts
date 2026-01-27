import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// interface
import { I_Recipe } from '../../../models/recipe.model';
// pipes
import { UcfirstPipe } from '../../../shared/pipes/ucFirst/ucfirst.pipe';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [RouterLink, UcfirstPipe, JsonPipe],
  templateUrl: './recipes-list.html',
  styleUrl: './recipes-list.scss',
})
export class RecipesList {
  public recipes = input.required<I_Recipe[]>();
  public headline = input<string>('Alle Rezepte');
}
