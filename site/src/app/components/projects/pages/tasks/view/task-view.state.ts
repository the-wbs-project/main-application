import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Activity, ListItem, Project, WbsNode } from '@wbs/shared/models';
import {
  ContainerService,
  DataServiceFactory,
  Messages,
  WbsTransformers,
} from '@wbs/shared/services';
import { WbsNodeView } from '@wbs/shared/view-models';
import { forkJoin, map, Observable, of, tap } from 'rxjs';
import { PAGE_VIEW_TYPE } from './models';
import { RemoveTask, TaskPageChanged, VerifyTask } from './task-view.actions';

interface StateModel {
  activity?: Activity[];
  current?: WbsNode;
  deleteReasons?: ListItem[];
  discipline?: WbsNodeView;
  pageView?: PAGE_VIEW_TYPE;
  phase?: WbsNodeView;
  project?: Project;
  projectNodes?: WbsNode[];
  subTasks?: WbsNodeView[];
}

@Injectable()
@State<StateModel>({
  name: 'taskView',
  defaults: {},
})
export class TaskViewState {
  constructor(
    private readonly containers: ContainerService,
    private readonly data: DataServiceFactory,
    private readonly dialog: DialogService,
    private readonly messages: Messages,
    private readonly transformers: WbsTransformers
  ) {}

  @Selector()
  static activity(state: StateModel): Activity[] | undefined {
    return state.activity;
  }

  @Selector()
  static current(state: StateModel): WbsNode | undefined {
    return state.current;
  }

  @Selector()
  static discipline(state: StateModel): WbsNodeView | undefined {
    return state.discipline;
  }

  @Selector()
  static pageView(state: StateModel): PAGE_VIEW_TYPE | undefined {
    return state.pageView;
  }

  @Selector()
  static phase(state: StateModel): WbsNodeView | undefined {
    return state.phase;
  }

  @Selector()
  static project(state: StateModel): Project | undefined {
    return state.project;
  }

  @Selector()
  static subTasks(state: StateModel): WbsNodeView[] | undefined {
    return state.subTasks;
  }

  @Action(VerifyTask)
  verifyProject(
    ctx: StateContext<StateModel>,
    action: VerifyTask
  ): Observable<void> | void {
    const state = ctx.getState();

    if (state.current?.id === action.taskId) return;

    return forkJoin({
      project: this.data.projects.getAsync(action.projectId),
      tasks: this.data.projectNodes.getAllAsync(action.projectId),
      activity: this.data.activities.getAsync(action.projectId),
    }).pipe(
      map((data) => {
        const views = this.rebuildNodeViews(
          data.project,
          data.tasks,
          action.taskId
        );

        ctx.patchState({
          activity: data.activity.sort(this.sortActivity),
          current: data.tasks.find((x) => x.id === action.taskId),
          discipline: views[0],
          phase: views[1],
          project: data.project,
          projectNodes: data.tasks,
          subTasks: views[2],
        });
      })
    );
  }

  @Action(TaskPageChanged)
  projectViewChanged(
    ctx: StateContext<StateModel>,
    action: TaskPageChanged
  ): void {
    ctx.patchState({
      pageView: action.view,
    });
  }

  /*@Action(AddSubTask)
  addNodeToProject(
    ctx: StateContext<StateModel>,
    action: AddSubTask
  ): Observable<any> {
    const state = ctx.getState();
    const node = action.parent;

    node.id = IdService.generate();

    return this.data.projectNodes.putAsync(state.current!.id, node).pipe(
      // TO DO SEND ACTIVITY
      tap(() => {
        const nodes = [...ctx.getState().nodes!];
        nodes.push(node);

        ctx.patchState({
          nodes,
        });
      })
    );
  }*/

  @Action(RemoveTask)
  removeNodeToProject(
    ctx: StateContext<StateModel>,
    action: RemoveTask
  ): Observable<any> | void {
    const state = ctx.getState();
    const listObs = state.deleteReasons
      ? of(state.deleteReasons)
      : this.data.metdata.getListAsync('delete_reasons').pipe(
          tap((list) =>
            ctx.patchState({
              deleteReasons: list,
            })
          )
        );

    return listObs.pipe(
      map((list) => {
        //CONTINUE WORK
      })
    );
  }

  private copy<T>(x: T): T {
    return <T>JSON.parse(JSON.stringify(x));
  }

  private sortActivity(a: Activity, b: Activity): number {
    return a.timestamp - b.timestamp;
  }

  private rebuildNodeViews(
    project: Project,
    tasks: WbsNode[],
    taskId: string
  ): [WbsNodeView | undefined, WbsNodeView | undefined, WbsNodeView[]] {
    const discipline = this.transformers.nodes.discipline.view
      .run(project, tasks)
      .find((x) => x.id === taskId);
    const phases = this.transformers.nodes.phase.view.run(project, tasks);
    const childrenIds = this.getChildrenIds(taskId, tasks);

    return [
      discipline,
      phases.find((x) => x.id === taskId),
      phases.filter((x) => childrenIds.indexOf(x.id) > -1),
    ];
  }

  private getChildrenIds(taskId: string, tasks: WbsNode[]): string[] {
    const ids: string[] = tasks
      .filter((x) => x.parentId === taskId)
      .map((x) => x.id);

    for (const id of ids) {
      ids.push(...this.getChildrenIds(id, tasks));
    }

    return ids;
  }
}
