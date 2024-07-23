import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-abs-icon',
  template: `@if (iconClass(); as iconClass) {
    <div class="w-100 text-center" [title]="tooltip() | translate">
      <i [class]="iconClass"></i>
    </div>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
})
export class AbsIconComponent {
  readonly abs = input.required<string | undefined>();
  readonly iconClass = computed(() =>
    this.abs() === 'set'
      ? 'fas fa-check fw-bold'
      : this.abs() === 'implied'
      ? 'fas fa-check tx-gray-500'
      : undefined
  );
  readonly tooltip = computed(() =>
    this.abs() === 'set' ? 'Wbs.ABS-Tooltip' : 'Wbs.ABS-ImpliedTooltip'
  );
}
