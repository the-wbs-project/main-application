import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faTriangleExclamation } from '@fortawesome/pro-light-svg-icons';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { Select } from '@ngxs/store';
import { DiscussionViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { ProjectDiscussionState } from '../../states';

@Component({
  templateUrl: './project-discussion-write-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDiscussionWritePageComponent {
  readonly faPlus = faPlus;
  readonly faTriangleExclamation = faTriangleExclamation;
}
