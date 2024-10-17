import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleInfo,
  faExclamationTriangle,
  faThumbsUp,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-alert',
  template: `
    @if (isOpen()) {
    <div [ngClass]="'alert alert-' + type()">
      <div class="d-flex flex-align-center w-100">
        <div style="min-width: 40px;">
          <fa-icon [icon]="icon()" size="xl" />
        </div>
        <div class="flex-fill">
          @if (heading(); as heading) {
          <h4 class="alert-heading">{{ heading | translate }}</h4>
          } @if (message(); as message) { {{ message | translate }} } @else {
          <ng-content /> }
        </div>
        @if (dismissible()) {
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          (click)="close()"
        ></button>
        }
      </div>
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, FontAwesomeModule, TranslateModule],
})
export class AlertComponent {
  readonly type = input.required<'success' | 'danger' | 'warning' | 'info'>();
  readonly heading = input<string>();
  readonly message = input<string | undefined>();
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
  isOpen = signal<boolean>(true);

  readonly closed = output<void>();

  close() {
    this.isOpen.set(false);
    this.closed.emit();
  }
}
