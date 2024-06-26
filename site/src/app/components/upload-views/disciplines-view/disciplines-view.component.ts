import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList } from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-thin-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { ImportPerson, ProjectCategory } from '@wbs/core/models';
import { CategoryMatchListComponent } from '@wbs/components/_utils/category-match-list.component';
import { AlertComponent } from '@wbs/components/_utils/alert.component';

@Component({
  standalone: true,
  selector: 'wbs-upload-disciplines-view',
  templateUrl: './disciplines-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    ButtonModule,
    CategoryMatchListComponent,
    FontAwesomeModule,
    FormsModule,
    TranslateModule,
  ],
})
export class UploadDisciplinesViewComponent {
  readonly faList = faList;
  readonly faCircle = faCircle;
  readonly continue = output<void>();
  readonly disciplines = input.required<ProjectCategory[]>();
  readonly peopleList = model.required<ImportPerson[]>();
}
