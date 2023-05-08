import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { UserLite } from '@wbs/core/models';

@Component({
  selector: 'wbs-project-user-list',
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectUserListComponent {
  @Input({ required: true }) icon!: IconDefinition;
  @Input({ required: true }) users!: UserLite[];
  @Input() noUsersLabel!: string;
  @Output() readonly selected = new EventEmitter<UserLite>();
}
