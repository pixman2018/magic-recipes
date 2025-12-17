import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './components/layout/header-component/header-component';
import { Parent } from './example/testing/component/parent/parent';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Parent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    console.log('ENV', environment);

    const firestore = inject(Firestore);

    const collectionItem = collection(firestore, 'products');
    const item$ = collectionData(collectionItem);
    item$.subscribe((res) => console.log(res));
  }
}
