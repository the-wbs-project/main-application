import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { UploadDisciplinesViewComponent } from '@wbs/components/upload-views/disciplines-view';
import { ProjectCategory } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { PeopleCompleted } from '../actions';
import { ProjectUploadState } from '../states';

@Component({
  standalone: true,
  template: `<wbs-upload-disciplines-view
    [disciplines]="disciplines()"
    [peopleList]="peopleList()!"
    (continue)="nav()"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UploadDisciplinesViewComponent],
})
export class DisciplinesViewComponent {
  private readonly store = inject(SignalStore);

  readonly disciplines = input.required<ProjectCategory[]>();
  readonly peopleList = this.store.select(ProjectUploadState.peopleList);

  nav(): void {
    this.store.dispatch(new PeopleCompleted(this.peopleList()!));
  }
}
