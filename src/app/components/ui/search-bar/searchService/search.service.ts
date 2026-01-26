import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public searchQueryObject = signal<{ searchQuery: string; pageName: string } | null>(null);
}
