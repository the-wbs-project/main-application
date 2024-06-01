import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGrid, faTable } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-project-view-toggle',
  templateUrl: './project-view-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonGroupModule,
    ButtonModule,
    FontAwesomeModule,
    TranslateModule,
  ],
})
export class ProjectViewToggleComponent {
  readonly gridIcon = faGrid;
  readonly tableIcon = faTable;
  readonly view = model.required<'grid' | 'table'>();
}
