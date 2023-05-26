import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { ChecklistGroupResults } from '../../models';

@Component({
  selector: 'wbs-project-checklist',
  templateUrl: './project-checklist.component.html',
  styleUrls: ['./project-checklist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectChecklistComponent {
  @Input() expandIfFailed = false;
  @Input({ required: true }) checklist: ChecklistGroupResults[] | undefined;
}
