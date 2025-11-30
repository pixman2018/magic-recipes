import { Component, signal } from '@angular/core';
import { Child2 } from '../child2/child2';
import { single } from 'rxjs';

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [Child2],
  templateUrl: './parent.html',
  styleUrl: './parent.scss',
})
export class Parent {
  public title = signal<string>('Test Tour of Heroes');

  public firstname = 'John';
  public lastname = 'Doh';

  private test = 'Basis';
  protected test1 = 'Wert';
  public test2 = 'Angular';

  protected isAdmin = signal(false);
  protected headline = 'Child 2 from Parent';

  private getFullName() {
    return `${this.firstname} ${this.lastname}`;
  }

  protected onChanceModel() {
    this.isAdmin.set(!this.isAdmin());
  }
}
