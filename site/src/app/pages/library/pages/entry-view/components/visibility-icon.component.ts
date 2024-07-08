import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-visibility-icon',
  template: `@if (iconClass(); as iconClass) {
    <i [class]="iconClass" [title]="tooltip() | translate"></i> }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
})
export class VisibilityIconComponent {
  readonly visibility = input.required<string | undefined>();
  readonly iconClass = computed(() =>
    this.visibility() === 'private'
      ? 'fas fa-lock'
      : this.visibility() === 'impliedPrivate'
      ? 'fas fa-lock tx-gray-400'
      : undefined
  );
  readonly tooltip = computed(() =>
    this.visibility() === 'private'
      ? 'Wbs.PrivateTooltip'
      : 'Wbs.ImpliedPrivateTooltip'
  );
}
