import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { first } from 'rxjs/operators';
import { ProjectChecklistState } from '../../states';

@Component({
  selector: 'wbs-project-checklist-modal',
  templateUrl: './project-checklist-modal.component.html',
  styleUrls: ['./project-checklist-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
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
    this.modalService
      .open(this.content, {
        //modalDialogClass: 'checklist-modal',
      })
      .dismissed.pipe(first())
      .subscribe((value) => {
        console.log(value);
      });
  }
}
