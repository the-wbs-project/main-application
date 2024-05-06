import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { StepperModule } from '@progress/kendo-angular-layout';
import { StepperItem } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, StepperModule, TranslateModule],
  template: ` <kendo-stepper
    [steps]="cleanedSteps()"
    stepType="full"
    [linear]="false"
    [(currentStep)]="step"
  >
    <ng-template kendoStepperIndicatorTemplate let-step>
      @if (step.icon) { <fa-icon [icon]="step.icon" /> }
    </ng-template>
    <ng-template kendoStepperLabelTemplate let-step>
      {{ step.label | translate }}
      @if (step.optional) { <span class="mg-l-5">*</span> }
    </ng-template>
  </kendo-stepper>`,
})
export class StepperComponent {
  readonly steps = input.required<StepperItem[]>();
  readonly step = model.required<number>();
  readonly cleanedSteps = computed(() => {
    const steps = this.steps();
    const index = this.step();

    return steps.map(
      (step, i) =>
        ({
          ...step,
          disabled: i > index,
        } as StepperItem)
    );
  });
}
