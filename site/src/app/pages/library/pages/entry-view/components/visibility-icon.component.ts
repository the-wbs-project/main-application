import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-visibility-icon',
  template: `@if (visibility() === 'private') {
    <i class="fas fa-lock" [title]="'Wbs.PrivateTooltip' | translate"></i> }
    @else if (visibility() === 'impliedPrivate') {
    <i
      class="fas fa-lock tx-gray-400"
      [title]="'Wbs.ImpliedPrivateTooltip' | translate"
    ></i>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, TranslateModule],
})
export class VisibilityIconComponent {
  readonly lockIcon = faLock;
  readonly visibility = input.required<string | undefined>();
}
