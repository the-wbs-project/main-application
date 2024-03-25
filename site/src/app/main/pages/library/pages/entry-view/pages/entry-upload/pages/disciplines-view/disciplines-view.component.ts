import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList } from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-thin-svg-icons';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ImportPerson } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { CategoryMatchListComponent } from '@wbs/main/components/category-match-list.component';
import { PeopleCompleted } from '../../actions';
import { EntryUploadState } from '../../states';
import { AlertComponent } from '@wbs/main/components/alert.component';

@Component({
  standalone: true,
  templateUrl: './disciplines-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    CategoryMatchListComponent,
    FontAwesomeModule,
    FormsModule,
    TranslateModule,
  ],
})
export class DisciplinesViewComponent {
  private readonly store = inject(SignalStore);

  readonly disciplines = input.required<{ id: string; label: string }[]>();
  readonly peopleList = this.store.select(EntryUploadState.peopleList);
  readonly faCircle = faCircle;
  readonly faList = faList;

  nav(results: ImportPerson[]): void {
    this.store.dispatch(new PeopleCompleted(results));
  }
}
