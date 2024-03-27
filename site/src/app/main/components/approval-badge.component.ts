import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBadge,
  faCheck,
  faQuestion,
  faX,
} from '@fortawesome/pro-solid-svg-icons';
import { ProjectApproval } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-approval-badge',
  template: `@if (approval(); as approval) {
    <a
      class="pointer"
      [style.fontSize.px]="fontSize"
      [ngClass]="{
        'tx-gray-600-f': approval.isApproved == undefined,
        'tx-success-f': approval.isApproved === true,
        'tx-danger-f': approval.isApproved === false
      }"
      [title]="approval.id + ' ' + approval.isApproved"
      (click)="setApproval.emit()"
    >
      <fa-layers [fixedWidth]="true" size="2x">
        <fa-icon [icon]="faBadge" />
        <fa-icon
          [inverse]="true"
          transform="shrink-8"
          [icon]="
            approval.isApproved === true
              ? faCheck
              : approval.isApproved === false
              ? faX
              : faQuestion
          "
        />
      </fa-layers>
    </a>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass],
})
export class ApprovalBadgeComponent {
  readonly approval = input<ProjectApproval>();
  readonly childrenIds = input<string[] | undefined>();
  readonly fontSize = input<number>(11);
  readonly setApproval = output<void>();

  readonly faQuestion = faQuestion;
  readonly faX = faX;
  readonly faCheck = faCheck;
  readonly faBadge = faBadge;
}
