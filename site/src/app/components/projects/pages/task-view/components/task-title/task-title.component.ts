import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { ChangeTaskTitle } from '../../../../project.actions';

@Component({
  selector: 'wbs-task-title',
  templateUrl: './task-title.component.html',
  styleUrls: ['./task-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TaskTitleComponent {
  @Input() taskId: string | undefined;
  @Input() title: string | undefined;

  readonly edit$ = new BehaviorSubject<boolean>(false);

  editValue = '';

  constructor(private readonly store: Store) {}

  edit(): void {
    this.editValue = this.title!;
    this.edit$.next(true);
  }

  saveTitle(): void {
    this.store
      .dispatch(new ChangeTaskTitle(this.taskId!, this.editValue))
      .subscribe(() => this.edit$.next(false));
  }
}
