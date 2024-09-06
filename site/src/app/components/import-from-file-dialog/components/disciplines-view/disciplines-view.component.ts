import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle } from '@fortawesome/pro-thin-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { CategoryMatchListComponent } from '@wbs/components/_utils/category-match-list.component';
import { CategoryViewModel } from '@wbs/core/view-models';
import { ProjectPlanPerson } from '../../models';

@Component({
  standalone: true,
  selector: 'wbs-upload-disciplines-view',
  templateUrl: './disciplines-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    CategoryMatchListComponent,
    FontAwesomeModule,
    TranslateModule,
  ],
})
export class DisciplinesViewComponent {
  readonly circleIcon = faCircle;
  //
  //  Inputs
  //
  readonly disciplines = input.required<CategoryViewModel[]>();
  readonly peopleList = model.required<ProjectPlanPerson[]>();
}
