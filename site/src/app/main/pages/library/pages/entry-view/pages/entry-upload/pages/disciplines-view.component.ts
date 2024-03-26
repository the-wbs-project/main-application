import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ImportPerson } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { UploadDisciplinesViewComponent } from '@wbs/main/components/upload-views/disciplines-view';
import { PeopleCompleted } from '../actions';
import { EntryUploadState } from '../states';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UploadDisciplinesViewComponent],
  template: `@if (peopleList(); as people) {
    <wbs-upload-disciplines-view
      [disciplines]="disciplines()"
      [peopleList]="people"
      (continue)="nav(people)"
    />
    }`,
})
export class DisciplinesViewComponent {
  private readonly store = inject(SignalStore);

  readonly disciplines = input.required<{ id: string; label: string }[]>();
  readonly peopleList = this.store.select(EntryUploadState.peopleList);

  nav(results: ImportPerson[]): void {
    this.store.dispatch(new PeopleCompleted(results));
  }
}
