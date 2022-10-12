import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {
  faCancel,
  faEraser,
  faFloppyDisk,
  faPencil,
} from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { ListItem } from '@wbs/shared/models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'wbs-project-disciplines',
  templateUrl: './project-disciplines.component.html',
  styleUrls: ['./project-disciplines.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectDisciplinesComponent {
  @Input() disciplines: (string | ListItem)[] | undefined;

  readonly faCancel = faCancel;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faEraser = faEraser;
  readonly faPencil = faPencil;
  readonly edit$ = new BehaviorSubject<boolean>(false);

  editValue = '';

  constructor(private readonly store: Store) {}

  editTitle(): void {
    this.editValue = this.title!;
    this.edit$.next(true);
  }

  saveTitle(): void {
    this.store
      .dispatch(new ChangeProjectTitle(this.editValue))
      .subscribe(() => this.edit$.next(false));
  }
}
