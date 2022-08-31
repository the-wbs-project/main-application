import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClosedEditor, WbsNodeDeleteService } from '@wbs/components/_features';
import {
  ACTIONS,
  Activity,
  Project,
  PROJECT_NODE_VIEW,
  ROLES,
  WbsNode,
} from '@wbs/shared/models';
import { DataServiceFactory, WbsTransformers } from '@wbs/shared/services';
import { WbsNodeView } from '@wbs/shared/view-models';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import {
  RebuildNodeViews,
  RemoveTask,
  SaveUpload,
  SetProject,
  TreeReordered,
  VerifyProject,
} from '../project.actions';
import { UserRole } from '../models';

interface StateModel {
  activity?: Activity[];
  current?: Project;
  disciplines?: WbsNodeView[];
  nodes?: WbsNode[];
  phases?: WbsNodeView[];
  roles: UserRole[];
}

@Injectable()
@State<StateModel>({
  name: 'project',
  defaults: {
    roles: [
      {
        role: ROLES.PM,
        userId: 'auth0-cw',
      },
      {
        role: ROLES.SME,
        userId: 'auth0-bh',
      },
    ],
  },
})
export class ProjectState {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly deleteService: WbsNodeDeleteService,
    private readonly transformers: WbsTransformers
  ) {}

  @Selector()
  static activity(state: StateModel): Activity[] | undefined {
    return state.activity;
  }

  @Selector()
  static current(state: StateModel): Project | undefined {
    return state.current;
  }

  @Selector()
  static disciplines(state: StateModel): WbsNodeView[] | undefined {
    return state.disciplines;
  }

  @Selector()
  static nodes(state: StateModel): WbsNode[] | undefined {
    return state.nodes;
  }

  @Selector()
  static phases(state: StateModel): WbsNodeView[] | undefined {
    return state.phases;
  }

  @Selector()
  static roles(state: StateModel): UserRole[] {
    return state.roles;
  }

  @Action(VerifyProject)
  verifyProject(
    ctx: StateContext<StateModel>,
    action: VerifyProject
  ): Observable<void> {
    const state = ctx.getState();

    return state.current?.id !== action.projectId
      ? ctx.dispatch(new SetProject(action.projectId))
      : of();
  }

  @Action(SetProject)
  setProject(
    ctx: StateContext<StateModel>,
    action: SetProject
  ): Observable<void> {
    return forkJoin({
      project: this.data.projects.getAsync(action.projectId),
      nodes: this.data.projectNodes.getAllAsync(action.projectId),
      activity: this.data.activities.getAsync(action.projectId),
    }).pipe(
      tap((data) =>
        ctx.patchState({
          activity: data.activity.sort(this.sortActivity),
          current: data.project,
          nodes: data.nodes,
        })
      ),
      switchMap(() => ctx.dispatch(new RebuildNodeViews()))
    );
  }

  @Action(RebuildNodeViews)
  rebuildNodeViews(ctx: StateContext<StateModel>): Observable<void> | void {
    const state = ctx.getState();

    if (!state.current || !state.nodes) return;

    ctx.patchState({
      disciplines: this.transformers.nodes.discipline.view.run(
        state.current,
        state.nodes
      ),
      phases: this.transformers.nodes.phase.view.run(
        state.current,
        state.nodes
      ),
    });
    return ctx.dispatch(new ClosedEditor());
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
    return this.deleteService.launchAsync().pipe(
      switchMap((reason) => {
        if (!reason) return of();

        const state = ctx.getState();
        const nodes: WbsNode[] = JSON.parse(JSON.stringify(state.nodes));
        const nodeIndex = nodes.findIndex((x) => x.id === action.nodeId);

        if (nodeIndex === -1) return of();

        nodes[nodeIndex].removed = true;

        let changedIds: string[] = [action.nodeId];

        changedIds.push(
          ...this.transformers.nodes.phase.reorderer.run(state.current!, nodes)
        );
        /*changedIds.push(
          ...this.transformers.nodes.discipline.reorderer.run(state.current!, nodes)
        );*/
        const changed: Observable<void>[] = [];
        const parentId = state.current!.id;

        for (const node of nodes) {
          if (changedIds.indexOf(node.id) === -1) continue;

          changed.push(this.data.projectNodes.putAsync(parentId, node));
        }
        return forkJoin(changed).pipe(
          map(() =>
            ctx.patchState({
              nodes,
            })
          ),
          switchMap(() => ctx.dispatch(new RebuildNodeViews())),
          switchMap(() =>
            action.completedAction ? ctx.dispatch(action.completedAction) : of()
          )
        );
        /*
          return this.data.projectNodes.putAsync(state.current!.id, node).pipe(
            // TO DO SEND REASON
            // TO DO SEND ACTIVITY
            map(() => {
              nodes[nodeIndex] = node;
              ctx.patchState({
                nodes: [...nodes],
              });
            })
          );
        */
      })
    );
  }

  @Action(TreeReordered)
  treeReordered(
    ctx: StateContext<StateModel>,
    action: TreeReordered
  ): Observable<any> {
    const state = ctx.getState();
    const project = state.current!;
    const models = state.nodes!;
    const upserts: WbsNode[] = [];
    const nodeViews =
      (action.view === PROJECT_NODE_VIEW.DISCIPLINE
        ? state.disciplines
        : state.phases) ?? [];

    const originalNode = nodeViews.find((x) => x.id === action.draggedId)!;
    const newNode = action.rows.find((x) => x.id === action.draggedId)!;

    for (const vm of nodeViews) {
      const vm2 = action.rows.find((x) => x.id === vm.id);

      if (!vm2) continue;
      if (vm.order === vm2.order && vm.parentId === vm2.parentId) continue;

      const orig = models.find((x) => x.id === vm.id)!;
      const model = this.copy(orig);

      model.order = vm2.order;
      model.parentId = vm2.parentId;

      upserts.push(model);
    }

    if (upserts.length === 0) return of();

    return this.data.projectNodes.batchAsync(project.id, upserts, []).pipe(
      tap(() => {
        const nodes = ctx.getState().nodes!;

        for (const node of upserts) {
          const index = nodes.findIndex((x) => x.id === node.id);

          if (index > -1) nodes[index] = node;
          else nodes.push(node);
        }
        ctx.patchState({
          nodes,
        });
      }),
      tap(() =>
        this.data.activities.putAsync({
          action: ACTIONS.NODE_REORDERED,
          data: [originalNode.title, originalNode.levelText, newNode.levelText],
          labelTitle: 'Actions.NodeRecordered',
          objectId: action.draggedId,
          topLevelId: project.id,
        })
      ),
      tap(() => ctx.dispatch(new RebuildNodeViews()))
    );
  }

  @Action(SaveUpload)
  saveUpload(
    ctx: StateContext<StateModel>,
    action: SaveUpload
  ): Observable<any> {
    const state = ctx.getState();
    const project = state.current!;
    var saves: Observable<any>[] = [];

    if (action.results.cats !== project.categories.phase) {
      project.categories.phase = action.results.cats;

      saves.push(
        this.data.projects.putAsync(project).pipe(
          tap(() =>
            ctx.patchState({
              current: project,
            })
          )
        )
      );
    }
    if (
      action.results.removeIds.length > 0 ||
      action.results.upserts.length > 0
    ) {
      saves.push(
        this.data.projectNodes
          .batchAsync(
            project.id,
            action.results.upserts,
            action.results.removeIds
          )
          .pipe(
            tap(() => {
              const nodes = ctx.getState().nodes!;

              for (const id of action.results.removeIds) {
                const index = nodes.findIndex((x) => x.id === id);

                if (index > -1) nodes.splice(index, 1);
              }
              for (const node of action.results.upserts) {
                const index = nodes.findIndex((x) => x.id === node.id);

                if (index > -1) nodes[index] = node;
                else nodes.push(node);
              }
              ctx.patchState({
                nodes,
              });
            })
          )
      );
    }

    return saves.length === 0
      ? of()
      : forkJoin(saves).pipe(tap(() => ctx.dispatch(new RebuildNodeViews())));
  }

  private copy<T>(x: T): T {
    return <T>JSON.parse(JSON.stringify(x));
  }

  private sortActivity(a: Activity, b: Activity): number {
    return a.timestamp - b.timestamp;
  }
}
