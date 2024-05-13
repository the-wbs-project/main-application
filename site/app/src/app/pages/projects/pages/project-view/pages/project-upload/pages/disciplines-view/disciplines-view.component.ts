import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList } from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-thin-svg-icons';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ImportPerson } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { CategoryMatchListComponent } from '@wbs/components/_utils/category-match-list.component';
import { PeopleCompleted } from '../../actions';
import { ProjectUploadState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './disciplines-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryMatchListComponent,
    FontAwesomeModule,
    FormsModule,
    NgbAlertModule,
    TranslateModule,
  ],
})
export class DisciplinesViewComponent {
  readonly disciplines = input.required<{ id: string; label: string }[]>();
  readonly peopleList = this.store.select(ProjectUploadState.peopleList);
  readonly faCircle = faCircle;
  readonly faList = faList;

  constructor(private readonly store: SignalStore) {}

  nav(results: ImportPerson[]): void {
    this.store.dispatch(new PeopleCompleted(results));
  }
}
