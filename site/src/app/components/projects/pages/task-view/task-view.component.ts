import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { Project, WbsNode } from '@wbs/shared/models';
import { TitleService } from '@wbs/shared/services';
import { UiState } from '@wbs/shared/states';
import { TimelineViewModel, WbsNodeView } from '@wbs/shared/view-models';
import { Observable } from 'rxjs';
import { ChangeTaskTitle, CreateTask, RemoveTask } from '../../actions';
import { ProjectState, ProjectTimelineState } from '../../states';
import { MenuItems, PAGE_VIEW_TYPE } from './models';
import { TaskViewState } from './task-view.state';

@Component({
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskViewComponent {
  @Select(UiState.mainContentWidth) width$!: Observable<number>;
  @Select(TaskViewState.current) current$!: Observable<WbsNode>;
  @Select(TaskViewState.pageView) pageView$!: Observable<PAGE_VIEW_TYPE>;
  @Select(ProjectState.current) project$!: Observable<Project>;
  @Select(TaskViewState.subTasks) subTasks$!: Observable<WbsNodeView[]>;
  @Select(TaskViewState.viewDiscipline)
  viewDiscipline$!: Observable<WbsNodeView>;
  @Select(TaskViewState.viewPhase) viewPhase$!: Observable<WbsNodeView>;
  @Select(ProjectTimelineState.task) timeline$!: Observable<
    TimelineViewModel[]
  >;

  readonly links = MenuItems.links;
  readonly actions = MenuItems.actions;

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

  private get taskId(): string {
    return this.route.snapshot.params['taskId'];
  }

  viewChanged(view: string): void {
    this.store.dispatch(
      new Navigate(['projects', 'view', this.projectId, view])
    );
  }

  actionClicked(action: string): void {
    if (action === 'addSub') {
      this.store.dispatch(new CreateTask(this.taskId));
    } else if (action === 'delete') {
      this.store.dispatch(
        new RemoveTask(
          this.taskId,
          new Navigate(['/projects', this.projectId, 'view', 'phases'])
        )
      );
    }
  }

  saveTitle(newTitle: string): void {
    this.store.dispatch(new ChangeTaskTitle(this.taskId, newTitle));
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
