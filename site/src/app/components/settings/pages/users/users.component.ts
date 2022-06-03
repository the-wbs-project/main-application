import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { User } from '@wbs/shared/models';
import { UiState } from '@wbs/shared/states';
import { map, Observable } from 'rxjs';
import { UserAdminState } from '../../states';

@Component({
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  @Select(UserAdminState.users) users$!: Observable<User[] | undefined>;
  readonly view$: Observable<string>;

  constructor(route: ActivatedRoute) {
    this.view$ = route.params.pipe(map((x) => x['view']));
  }
}
