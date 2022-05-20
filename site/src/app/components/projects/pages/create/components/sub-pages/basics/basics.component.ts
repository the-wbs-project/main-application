import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SubmitBasics } from '../../../project-create.actions';
import { ProjectCreateState } from '../../../project-create.state';

@Component({
  selector: 'app-project-create-basics',
  templateUrl: './basics.component.html',
  styleUrls: ['./basics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicsComponent {
  @Select(ProjectCreateState.title) title$!: Observable<string | undefined>;

  constructor(private readonly store: Store) {}

  nav(title: string): void {
    this.store.dispatch(new SubmitBasics(title.trim()));
  }
}
