import { Component, input } from '@angular/core';
import { I_Recipe } from '../../../models/recipe';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './recipes-list.html',
  styleUrl: './recipes-list.scss',
})
export class RecipesList {
  recipes$ = input.required<Observable<I_Recipe[]>>();
  headline = input<string>('Alle Rezepte');
}
