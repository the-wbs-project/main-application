import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '@wbs/components/_utils/loading.component';
import { ProjectCategoryIconPipe } from '@wbs/pipes/project-category-icon.pipe';
import { ProjectCategoryLabelPipe } from '@wbs/pipes/project-category-label.pipe';
import { ActionButtonComponent } from '@wbs/components/action-button';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Utils } from '@wbs/core/services';
import { TextTransformPipe } from '@wbs/pipes/text-transform.pipe';
import { switchMap } from 'rxjs';
import { ProjectActionButtonService } from './services';
import { ProjectStore } from './stores';

@Component({
  standalone: true,
  templateUrl: './project-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ActionButtonComponent,
    LoadingComponent,
    ProjectCategoryIconPipe,
    ProjectCategoryLabelPipe,
    RouterModule,
    TextTransformPipe,
    TranslateModule,
  ],
})
export class ProjectViewComponent implements OnInit {
  private readonly data = inject(DataServiceFactory);
  private readonly route = inject(ActivatedRoute);

  readonly checkIcon = faCheck;
  readonly store = inject(ProjectStore);
  readonly menuService = inject(ProjectActionButtonService);
  readonly loaded = signal(true);
  readonly recordId = Utils.getParam(this.route.snapshot, 'recordId');

  /*readonly approvalEnabled = this.store.select(ProjectApprovalState.enabled);
  readonly approval = this.store.select(ProjectApprovalState.current);
  readonly approvals = this.store.select(ProjectApprovalState.list);
  readonly approvalView = this.store.select(ProjectApprovalState.view);
  readonly showApproval = computed(
    () => this.approvalView() === 'project' && this.approval() != undefined
  );
  readonly approvalHasChildren = this.store.select(
    ProjectApprovalState.hasChildren
  );
  readonly chat = this.store.select(ProjectApprovalState.messages);*/

  readonly menu = computed(() =>
    this.menuService.buildMenu(this.store.project())
  );

  ngOnInit(): void {
    const owner = Utils.getParam(this.route.snapshot, 'org');

    if (!owner || !this.recordId) return;

    this.data.projects
      .getIdAsync(owner, this.recordId)
      .pipe(
        switchMap((projectId) => this.data.projects.getAsync(owner, projectId))
      )
      .subscribe(({ project, tasks, claims }) => {
        this.store.setAll(project, tasks, claims);
        //this.store.dispatch(new InitiateChecklist());
        this.loaded.set(false);
      });
  }
}
