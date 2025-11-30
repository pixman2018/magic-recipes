import { Component, model } from '@angular/core';

@Component({
  selector: 'app-child2',
  standalone: true,
  imports: [],
  templateUrl: './child2.html',
  styleUrl: './child2.scss',
})
export class Child2 {
  role = model(false);
  headline = model('Child 2');

  constructor() {}

  protected onChance() {
    this.headline.set('New Child');
  }
}
