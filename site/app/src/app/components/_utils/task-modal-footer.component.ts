import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { WbsNodeView } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-task-modal-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, TranslateModule],
  host: { class: 'w-100' },
  template: `<div class="d-flex w-100">
    <div class="tx-left flex-grow-1">
      @if (task().previousTaskId; as taskId) {
      <a class="btn btn-outline-dark" [routerLink]="['../', taskId, 'about']">
        {{ 'General.Previous' | translate }}
      </a>
      }
    </div>
    <div class="tx-right flex-grow-1">
      @if (task().nextTaskId; as taskId) {
      <a class="btn btn-outline-dark" [routerLink]="['../', taskId, 'about']">
        {{ 'General.Next' | translate }}
      </a>
      }
    </div>
  </div>`,
})
export class TaskModalFooterComponent {
  readonly task = input.required<WbsNodeView>();
}
