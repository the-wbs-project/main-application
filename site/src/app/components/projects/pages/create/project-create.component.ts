import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PROJECT_CREATION_PAGES_TYPE } from './models';
import { ProjectCreateState } from './project-create.state';

@Component({
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectCreateComponent {
  @Select(ProjectCreateState.page) page$!: Observable<
    PROJECT_CREATION_PAGES_TYPE | undefined
  >;
}
