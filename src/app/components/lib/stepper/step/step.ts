import { Component, effect, input, WritableSignal } from '@angular/core';

@Component({
  selector: 'lib-step',
  imports: [],
  templateUrl: './step.html',
  styleUrl: './step.scss',
})
export class Step {
  public currentStep = input.required<WritableSignal<number>>();
}
