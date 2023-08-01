import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { UserLite } from '@wbs/core/models';
import { UserSortPipe } from '@wbs/main/pipes/user-sort.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-user-list',
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FontAwesomeModule, TranslateModule, UserSortPipe],
})
export class ProjectUserListComponent {
  @Input({ required: true }) icon!: IconDefinition;
  @Input({ required: true }) users!: UserLite[];
  @Input() noUsersLabel!: string;
  @Output() readonly selected = new EventEmitter<UserLite>();
}
