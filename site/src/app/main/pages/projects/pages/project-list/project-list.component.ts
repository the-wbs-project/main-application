import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { PROJECT_VIEW_STATI, PROJECT_VIEW_STATI_TYPE } from '@wbs/core/models';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';
import { EditedDateTextPipe } from '@wbs/main/pipes/edited-date-text.pipe';
import { ProjectStatusPipe } from '@wbs/main/pipes/project-status.pipe';
import { MembershipState } from '@wbs/main/states';
import { map } from 'rxjs';
import { ProjectTypeFilterPipe } from './pipes/project-type-filter.pipe';
import { ProjectStatusFilterPipe } from './pipes/project-status-filter.pipe';
import { plusIcon } from '@progress/kendo-svg-icons';
import { SVGIconModule } from '@progress/kendo-angular-icons';

@Component({
  standalone: true,
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryLabelPipe,
    CommonModule,
    EditedDateTextPipe,
    FillElementDirective,
    LoaderModule,
    ProjectStatusFilterPipe,
    ProjectStatusPipe,
    ProjectTypeFilterPipe,
    RouterModule,
    SVGIconModule,
    TranslateModule,
  ],
})
export class ProjectListComponent {
  readonly faPlus = faPlus;
  readonly owner = toSignal(
    this.route.params.pipe(map((p) => <string>p['owner']))
  );
  readonly status = toSignal(
    this.route.params.pipe(map((p) => <string>p['status']))
  );
  readonly type = toSignal(
    this.route.params.pipe(map((p) => <string>p['type']))
  );
  readonly loading = toSignal(this.store.select(MembershipState.loading));
  readonly projects = toSignal(this.store.select(MembershipState.projects));
  readonly stati: PROJECT_VIEW_STATI_TYPE[] = [
    PROJECT_VIEW_STATI.ACTIVE,
    PROJECT_VIEW_STATI.PLANNING,
    PROJECT_VIEW_STATI.EXECUTION,
    PROJECT_VIEW_STATI.FOLLOW_UP,
    PROJECT_VIEW_STATI.CLOSED,
  ];

  readonly plusIcon = plusIcon;

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute
  ) {}
}
