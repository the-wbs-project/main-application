import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SVGIconModule, SVGIcon } from '@progress/kendo-angular-icons';
import { Member } from '@wbs/core/models';
import { UserSortPipe } from '@wbs/main/pipes/user-sort.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-user-list',
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SVGIconModule, TranslateModule, UserSortPipe],
})
export class ProjectUserListComponent {
  @Input({ required: true }) icon!: SVGIcon;
  @Input({ required: true }) users!: Member[];
  @Input() noUsersLabel!: string;
  @Output() readonly selected = new EventEmitter<Member>();
}
