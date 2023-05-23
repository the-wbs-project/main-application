import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChecklistGroupResults } from '../../models';

@Component({
  selector: 'wbs-project-checklist',
  templateUrl: './project-checklist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectChecklistComponent {
  @Input() expandIfFailed = false;
  @Input({ required: true }) checklist: ChecklistGroupResults[] | undefined;
}
