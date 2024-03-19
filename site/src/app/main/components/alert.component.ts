import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleInfo,
  faExclamationTriangle,
  faThumbsUp,
} from '@fortawesome/pro-solid-svg-icons';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-alert',
  template: `@if(message(); as message) {
    <ngb-alert
      [type]="type()"
      [animation]="animation()"
      [dismissible]="dismissible()"
      (closed)="closed.emit()"
    >
      <div class="d-flex flex-align-center w-100">
        <div style="min-width: 40px;">
          <fa-icon [icon]="icon()" size="xl" />
        </div>
        <div class="flex-fill">
          {{ message | translate }}
        </div>
      </div>
    </ngb-alert>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbAlertModule, FontAwesomeModule, TranslateModule],
})
export class AlertComponent {
  readonly type = input.required<'success' | 'danger' | 'warning' | 'info'>();
  readonly message = input.required<string>();
  readonly animation = input<boolean>(true);
  readonly dismissible = input<boolean>(true);
  readonly icon = computed(() => {
    const type = this.type();

    return type === 'info'
      ? faCircleInfo
      : type === 'success'
      ? faThumbsUp
      : faExclamationTriangle;
  });
  readonly closed = output<void>();
}
