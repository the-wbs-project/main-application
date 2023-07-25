import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { ChecklistGroupResults } from '../../models';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ChecklistResultIconPipe } from '../../pipes/checklist-result-icon.pipe';
import { ChecklistResultClassPipe } from '../../pipes/checklist-result-class.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-checklist',
  templateUrl: './project-checklist.component.html',
  styleUrls: ['./project-checklist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ChecklistResultIconPipe, ChecklistResultClassPipe, CommonModule, FontAwesomeModule, NgbAccordionModule, TranslateModule],
})
export class ProjectChecklistComponent {
  @Input() expandIfFailed = false;
  @Input({ required: true }) checklist: ChecklistGroupResults[] | undefined;
}
