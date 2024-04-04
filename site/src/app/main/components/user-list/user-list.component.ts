import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SVGIconModule, SVGIcon } from '@progress/kendo-angular-icons';
import { Member } from '@wbs/core/models';
import { sorter } from '@wbs/main/services';

@Component({
  standalone: true,
  selector: 'wbs-project-user-list',
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SVGIconModule, TranslateModule],
})
export class ProjectUserListComponent {
  readonly selected = output<Member>();

  readonly icon = input.required<SVGIcon>();
  readonly users = input.required<Member[] | undefined>();
  readonly noUsersLabel = input<string>();

  readonly sortedUsers = computed(() =>
    (this.users() ?? []).sort((a, b) => sorter(a.name, b.name))
  );
}
