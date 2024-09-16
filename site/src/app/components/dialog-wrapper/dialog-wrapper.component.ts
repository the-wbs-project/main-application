import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { StepperModule } from '@progress/kendo-angular-layout';
import { ScrollToTopDirective } from '@wbs/core/directives/scrollToTop.directive';
import { StepperItem } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-dialog-wrapper',
  templateUrl: './dialog-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    NgClass,
    ScrollToTopDirective,
    StepperModule,
    TranslateModule,
  ],
})
export class DialogWrapperComponent {
  readonly view = input.required<number>();
  readonly steps = input.required<StepperItem[]>();
  readonly mobileSpot = input<'sm' | 'md' | 'lg' | undefined>(undefined);
  readonly stepLabelClass = computed(() => {
    const spot = this.mobileSpot();
    if (!spot) return '';
    return `d-none d-${spot}-block`;
  });
  readonly headerLabelClass = computed(() => {
    const spot = this.mobileSpot();
    if (!spot) return '';
    return `d-block d-${spot}-none`;
  });
}
