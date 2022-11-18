import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faList } from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-thin-svg-icons';
import { Select, Store } from '@ngxs/store';
import { ListItem } from '@wbs/core/models';
import { MetadataState } from '@wbs/core/states';
import { Observable } from 'rxjs';
import { PeopleCompleted } from '../../actions';
import { PeopleListItem } from '../../models';
import { ProjectUploadState } from '../../states';

@Component({
  templateUrl: './disciplines-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisciplinesViewComponent {
  @Select(MetadataState.disciplineCategories) categories$!: Observable<
    ListItem[]
  >;
  @Select(ProjectUploadState.peopleList) peopleList$!: Observable<
    PeopleListItem[]
  >;
  readonly faCircle = faCircle;
  readonly faList = faList;

  constructor(private readonly store: Store) {}

  nav(results: PeopleListItem[]): void {
    this.store.dispatch(new PeopleCompleted(results));
  }
}
