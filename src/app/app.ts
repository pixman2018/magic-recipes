import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './components/layout/header-component/header-component';
import { Parent } from './example/testing/component/parent/parent';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Parent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {}
}
