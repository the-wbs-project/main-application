import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  faClone,
  faCogs,
  faPencil,
  faPlus,
  faTrashAlt,
} from '@fortawesome/pro-solid-svg-icons';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { Project, PROJECT_NODE_VIEW, WbsNode } from '@wbs/shared/models';
import { TitleService } from '@wbs/shared/services';
import { UiState } from '@wbs/shared/states';
import { WbsNodeView } from '@wbs/shared/view-models';
import { Observable } from 'rxjs';
import { PAGE_VIEW, PAGE_VIEW_TYPE } from './models';
import { TaskViewState } from './task-view.state';

@Component({
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskViewComponent {
  @Select(UiState.mainContentWidth) width$!: Observable<number>;
  @Select(TaskViewState.current) current$!: Observable<WbsNode>;
  @Select(TaskViewState.discipline) discipline$!: Observable<WbsNodeView>;
  @Select(TaskViewState.phase) phase$!: Observable<WbsNodeView>;
  @Select(TaskViewState.pageView) pageView$!: Observable<PAGE_VIEW_TYPE>;
  @Select(TaskViewState.project) project$!: Observable<Project>;
  @Select(TaskViewState.subTasks) subTasks$!: Observable<WbsNodeView[]>;

  readonly faCogs = faCogs;
  readonly links = [
    {
      fragment: PAGE_VIEW.ABOUT,
      title: 'About',
    },
    {
      fragment: PAGE_VIEW.SUB_TASKS,
      title: 'Sub Tasks',
    },
    {
      fragment: PAGE_VIEW.TIMELINE,
      title: 'Timeline',
    },
    {
      fragment: PAGE_VIEW.RESOURCES,
      title: 'Resources',
    },
    {
      fragment: PAGE_VIEW.EDUATION,
      title: 'Education',
    },
  ];
  readonly actions = [
    {
      action: 'addSub',
      icon: faPlus,
      text: 'Add Sub-Task',
    },
    {
      action: 'edit',
      icon: faPencil,
      text: 'Edit Task',
    },
    {
      action: 'clone',
      icon: faClone,
      text: 'Clone Task',
    },
    {
      action: 'delete',
      icon: faTrashAlt,
      text: 'Delete Task',
    },
  ];

  constructor(
    title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {
    title.setTitle('Project', false);
  }

  private get projectId(): string {
    return this.route.snapshot.params['projectId'];
  }

  viewChanged(view: string): void {
    this.store.dispatch(
      new Navigate(['projects', 'view', this.projectId, view])
    );
  }

  actionClicked(action: string): void {
    //
  }

  combine(
    task?: WbsNodeView | null,
    tasks?: WbsNodeView[] | null
  ): WbsNodeView[] {
    const results: WbsNodeView[] = [];

    if (task) results.push(task);
    if (tasks) results.push(...tasks);

    return results;
  }

  /*action(action: string) {
    if (action === 'download') {
      this.store.dispatch(new DownloadNodes());
    } else if (action === 'upload') {
      this.store.dispatch(new UploadNodes());
    }
  }*/
}
