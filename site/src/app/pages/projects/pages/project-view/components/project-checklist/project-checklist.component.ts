import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ChecklistGroupResults } from '../../models';
import { ChecklistResultClassPipe } from '../../pipes/checklist-result-class.pipe';
import { ChecklistResultIconPipe } from '../../pipes/checklist-result-icon.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-checklist',
  templateUrl: './project-checklist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChecklistResultClassPipe,
    ChecklistResultIconPipe,
    FontAwesomeModule,
    NgClass,
    TranslateModule,
  ],
})
export class ProjectChecklistComponent {
  readonly checklist = input.required<ChecklistGroupResults[] | undefined>();
  readonly expandIfFailed = input<boolean>(false);
}
