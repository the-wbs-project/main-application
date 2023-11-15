import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ChecklistGroupResults } from '../../models';
import { ChecklistResultClassPipe } from '../../pipes/checklist-result-class.pipe';
import { ChecklistResultIconPipe } from '../../pipes/checklist-result-icon.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-checklist',
  templateUrl: './project-checklist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ChecklistResultClassPipe,
    ChecklistResultIconPipe,
    FontAwesomeModule,
    NgbAccordionModule,
    NgClass,
    TranslateModule,
  ],
})
export class ProjectChecklistComponent {
  @Input() expandIfFailed = false;
  @Input({ required: true }) checklist: ChecklistGroupResults[] | undefined;
}
