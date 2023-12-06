import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList } from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-thin-svg-icons';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { CategoryMatchListComponent } from '../../../../../../../components/category-match-list.component';
import { PeopleCompleted } from '../../actions';
import { PeopleListItem } from '../../models';
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
  @Input() disciplines!: { id: string; label: string }[];

  readonly peopleList = toSignal(
    this.store.select(ProjectUploadState.peopleList)
  );
  readonly faCircle = faCircle;
  readonly faList = faList;

  constructor(private readonly store: Store) {}

  nav(results: PeopleListItem[]): void {
    this.store.dispatch(new PeopleCompleted(results));
  }
}
