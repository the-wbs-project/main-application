import { NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import {
  faBadge,
  faCheck,
  faQuestion,
  faX,
} from '@fortawesome/pro-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { ProjectApproval } from '@wbs/core/models';
import { SetApproval } from '../actions';
import { ProjectApprovalState } from '../states';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'wbs-approval-badge',
  template: ` <a
    *ngIf="approval(); let approval"
    class="pointer tx-11"
    [ngClass]="{
      'tx-gray-600': approval.isApproved == undefined,
      'tx-success': approval.isApproved === true,
      'tx-danger': approval.isApproved === false
    }"
    (click)="setApproval(approval)"
  >
    <fa-layers [fixedWidth]="true" [size]="size">
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
export class ApprovalBadgeComponent implements OnInit {
  @Input({ required: true }) id!: string;
  @Input() size: SizeProp = '2x';

  readonly faQuestion = faQuestion;
  readonly faX = faX;
  readonly faCheck = faCheck;
  readonly faBadge = faBadge;
  readonly show = toSignal(this.store.select(ProjectApprovalState.started));
  readonly approval = signal<ProjectApproval | undefined>(undefined);

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store
      .select(ProjectApprovalState.list)
      .pipe(untilDestroyed(this))
      .subscribe((list) => {
        console.log('TEST');
        this.approval.set(list?.find((a) => a.id === this.id));
      });
  }

  setApproval(approval: ProjectApproval): void {
    this.store.dispatch(new SetApproval(approval));
  }
}
