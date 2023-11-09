import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBadge,
  faCheck,
  faQuestion,
  faX,
} from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { ProjectApproval } from '@wbs/core/models';
import { SetApproval } from '../actions';

@Component({
  standalone: true,
  selector: 'wbs-approval-badge',
  template: ` <a
    *ngIf="approval"
    class="pointer"
    [style.fontSize.px]="fontSize"
    [ngClass]="{
      'tx-gray-600': approval.isApproved == undefined,
      'tx-success': approval.isApproved === true,
      'tx-danger': approval.isApproved === false
    }"
    (click)="setApproval(approval)"
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
  </a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass, NgIf],
})
export class ApprovalBadgeComponent {
  @Input({ required: true }) approval?: ProjectApproval;
  @Input() fontSize: number = 11;

  readonly faQuestion = faQuestion;
  readonly faX = faX;
  readonly faCheck = faCheck;
  readonly faBadge = faBadge;

  constructor(private readonly store: Store) {}

  setApproval(approval: ProjectApproval): void {
    this.store.dispatch(new SetApproval(approval));
  }
}
