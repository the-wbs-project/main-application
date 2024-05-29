import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { WbsNodeView } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-task-modal-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, RouterModule, TranslateModule],
  host: { class: 'w-100' },
  template: `<div class="d-flex w-100">
    <div class="tx-left flex-grow-1">
      @if (task().previousTaskId; as taskId) {
      <button kendoButton size="small" [routerLink]="['../', taskId, 'about']">
        {{ 'General.Previous' | translate }}
      </button>
      }
    </div>
    <div class="tx-right flex-grow-1">
      @if (task().nextTaskId; as taskId) {
      <button kendoButton size="small" [routerLink]="['../', taskId, 'about']">
        {{ 'General.Next' | translate }}
      </button>
      }
    </div>
  </div>`,
})
export class TaskModalFooterComponent {
  readonly task = input.required<WbsNodeView>();
}
