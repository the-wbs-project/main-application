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
import { BehaviorSubject } from 'rxjs';
import { ChangeProjectTitle } from '../../../../project.actions';

@Component({
  selector: 'wbs-project-title',
  templateUrl: './project-title.component.html',
  styleUrls: ['./project-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectTitleComponent {
  @Input() title: string | undefined;

  readonly faCancel = faCancel;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faEraser = faEraser;
  readonly faPencil = faPencil;
  readonly edit$ = new BehaviorSubject<boolean>(false);

  editValue = '';

  constructor(private readonly store: Store) {}

  edit(): void {
    this.editValue = this.title!;
    this.edit$.next(true);
  }

  saveTitle(): void {
    this.store
      .dispatch(new ChangeProjectTitle(this.editValue))
      .subscribe(() => this.edit$.next(false));
  }
}
