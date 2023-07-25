import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { ProjectChecklistState } from '../../states';
import { ChangeProjectStatus } from '../../actions';
import { PROJECT_STATI } from '@wbs/core/models';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectChecklistComponent } from '../project-checklist/project-checklist.component';

@Component({
  standalone: true,
  selector: 'wbs-project-checklist-modal',
  templateUrl: './project-checklist-modal.component.html',
  styleUrls: ['./project-checklist-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ProjectChecklistComponent, TranslateModule]
})
export class ProjectChecklistModalComponent {
  @ViewChild('content') content!: any;

  readonly checklist = toSignal(
    this.store.select(ProjectChecklistState.results)
  );

  constructor(
    private readonly modalService: NgbModal,
    private readonly store: Store
  ) {}

  open(): void {
    const modal = this.modalService.open(this.content, {
      size: 'lg',
      ariaLabelledBy: 'modal-title',
    });

    modal.result.then((value) => {
      if (value === 'submit') {
        this.store.dispatch(new ChangeProjectStatus(PROJECT_STATI.APPROVAL));
      }
    });
    modal.dismissed.subscribe();
  }
}
