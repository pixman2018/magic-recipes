import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  public filterbject = signal<{ filter: string; pageName: string } | null>(null);
}
