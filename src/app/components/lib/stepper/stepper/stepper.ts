import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  signal,
  TemplateRef,
} from '@angular/core';
import { Step } from '../step/step';
import { JsonPipe } from '@angular/common';

/**
 * @description
 * Creates a stepper for forms. The step components are
 * In the step component, the currentStep must be bound as an input binding
 * transferred to the stepper content, and the form and control buttons
 * are placed in their content. Optionally, you can give the step a name.
 * 
 * Example
 * <lib-stepper>
    <lib-step [currentStep]="currentStep">
        <ng-template #legend>
            <div>Basis</div>
        </ng-template>
        <form id="step_1" class="step__hidden" [class.step__show]="currentStep() === 1">
            <div class="form-control">
                <label>
                    Vorname
                    <input type="text" id="firstname" placeholder="firstname"
                        [field]="firstEmpregisterForm.firstname" />
                </label>
                <lib-error-message [control]="firstEmpregisterForm.firstname" />
            </div>

            <div class="form-control">
                <label>
                    Nachname
                    <input type="text" id="lastname" class="" placeholder="lastname"
                        [field]="firstEmpregisterForm.lastname" />
                </label>
                <lib-error-message [control]="firstEmpregisterForm.lastname" />
            </div>

            <div class="step__action">
                <button type="button" [class.btn-disabled]="firstEmpregisterForm()?.invalid()"
                    [disabled]="firstEmpregisterForm()?.invalid()" (click)="onNextStep()">Next</button>
            </div>
        </form>
    </lib-step>
    <lib-step [currentStep]="currentStep">
    ...
    <lib-step />
    <lib-stepper>
 */
@Component({
  selector: 'lib-stepper',
  imports: [Step, JsonPipe],
  templateUrl: './stepper.html',
  styleUrl: './stepper.scss',
  host: {
    class: 'stepper',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stepper implements AfterContentInit {
  private _legendTemplates = contentChildren<TemplateRef<any>>('legend', { descendants: true });
  private _stepComponentRef = contentChildren<Step>(Step);
  protected legendValues: string[] = [];
  protected currentStepIndex = signal(0);

  constructor() {
    effect(() => {
      this.currentStepIndex.set(this._stepComponentRef()[0].currentStep()());
    });
  }
  ngAfterContentInit(): void {
    // fetches the content from the zemplateref of _legendTemplates
    this._legendTemplates().forEach((template: TemplateRef<any>, index: number) => {
      const context = { legend: 'Placeholder value' };
      const view = template.createEmbeddedView(context);
      const legendValue = view.rootNodes[0]?.textContent?.trim();

      this.legendValues.push(legendValue);
    });

    if (this.legendValues.length === 0) {
      for (let i = 1; i <= this._stepComponentRef().length; i++) {
        this.legendValues.push('');
      }
    }
  }
}
