import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { PROJECT_STATI } from '@wbs/core/models';
import { ProjectService } from '../../services';
import { ProjectChecklistState } from '../../states';
import { ProjectChecklistComponent } from '../project-checklist';

@Component({
  standalone: true,
  selector: 'wbs-project-checklist-modal',
  templateUrl: './project-checklist-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ProjectChecklistComponent, TranslateModule],
})
export class ProjectChecklistModalComponent {
  private readonly service = inject(ProjectService);
  private readonly store = inject(Store);

  @ViewChild('content') content!: any;

  readonly checklist = toSignal(
    this.store.select(ProjectChecklistState.results)
  );

  open(): void {
    /*const modal = this.modalService.open(this.content, {
      size: 'lg',
      ariaLabelledBy: 'modal-title',
    });

    // deepcode ignore PromiseNotCaughtGeneral: aint nobody got time for that
    modal.result.then((value) => {
      if (value === 'submit') {
        this.service.changeProjectStatus(PROJECT_STATI.APPROVAL).subscribe();
      }
    });
    modal.dismissed.subscribe();
  */
}
}