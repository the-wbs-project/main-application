import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList } from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-thin-svg-icons';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { ListItem } from '@wbs/core/models';
import { MetadataState } from '@wbs/core/states';
import { JoinPipe } from '@wbs/main/pipes/join.pipe';
import { Observable } from 'rxjs';
import { PeopleCompleted } from '../../actions';
import { PeopleListItem } from '../../models';
import { ProjectUploadState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './disciplines-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    JoinPipe,
    MultiSelectModule,
    NgbAlertModule,
    TranslateModule,
  ],
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
