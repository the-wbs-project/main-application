import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { ClosedEditor } from '@wbs/components/_features';
import {
  ACTIONS,
  Activity,
  Project,
  PROJECT_FILTER,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  ROLES,
  WbsNode,
} from '@wbs/shared/models';
import {
  ContainerService,
  DataServiceFactory,
  Messages,
  WbsTransformers,
} from '@wbs/shared/services';
import { WbsNodeView } from '@wbs/shared/view-models';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import {
  DownloadNodes,
  ProcessUploadedNodes,
  ProjectPageChanged,
  UploadNodes,
} from './project-view.actions';
import { ProjectNodeUploadDialogComponent } from './components';
import { PhaseExtractProcessor } from './services';
import { PAGE_VIEW, PAGE_VIEW_TYPE } from './models';
import { ProjectState } from '../../states';
import { SaveUpload } from '../../project.actions';

interface StateModel {
  navType: PROJECT_FILTER | null;
  pageView?: PAGE_VIEW_TYPE;
  viewNode?: PROJECT_NODE_VIEW_TYPE;
}

@Injectable()
@State<StateModel>({
  name: 'projectView',
  defaults: {
    navType: null,
  },
})
export class ProjectViewState {
  constructor(
    private readonly containers: ContainerService,
    private readonly data: DataServiceFactory,
    private readonly dialog: DialogService,
    private readonly messages: Messages,
    private readonly processors: PhaseExtractProcessor,
    private readonly store: Store
  ) {}

  @Selector()
  static navType(state: StateModel): PROJECT_FILTER | null {
    return state.navType;
  }

  @Selector()
  static pageView(state: StateModel): PAGE_VIEW_TYPE | undefined {
    return state.pageView;
  }

  @Selector()
  static viewNode(state: StateModel): PROJECT_NODE_VIEW_TYPE | undefined {
    return state.viewNode;
  }

  get project(): Project {
    return this.store.selectSnapshot(ProjectState.current)!;
  }

  @Action(ProjectPageChanged)
  projectViewChanged(
    ctx: StateContext<StateModel>,
    action: ProjectPageChanged
  ): void {
    ctx.patchState({
      pageView: action.view,
      viewNode:
        action.view === PAGE_VIEW.PHASES
          ? PROJECT_NODE_VIEW.PHASE
          : action.view === PAGE_VIEW.DISCIPLINES
          ? PROJECT_NODE_VIEW.DISCIPLINE
          : undefined,
    });
  }

  @Action(DownloadNodes)
  downloadNodes(ctx: StateContext<StateModel>): Observable<void> {
    const state = ctx.getState();

    this.messages.info('General.RetrievingData');

    return this.data.extracts.downloadNodesAsync(
      this.project,
      this.currentNodeViews(state),
      state.viewNode!
    );
  }

  @Action(UploadNodes)
  uploadNodes(ctx: StateContext<StateModel>): Observable<any> {
    const state = ctx.getState();

    const ref = this.dialog.open({
      content: ProjectNodeUploadDialogComponent,
      appendTo: this.containers.body,
    });
    const comp = <ProjectNodeUploadDialogComponent>ref.content.instance;

    comp.viewNode = state.viewNode;

    return ref.result.pipe(
      switchMap((result: DialogCloseResult | WbsNodeView[]) => {
        if (result instanceof DialogCloseResult) {
          return of(null);
        } else if (state.viewNode === PROJECT_NODE_VIEW.PHASE) {
          return ctx.dispatch(new ProcessUploadedNodes(result));
        } else {
          return of(null);
        }
      })
    );
  }

  @Action(ProcessUploadedNodes)
  processUploadedNodes(
    ctx: StateContext<StateModel>,
    action: ProcessUploadedNodes
  ): Observable<any> {
    const state = ctx.getState();

    if (state.viewNode === PROJECT_NODE_VIEW.DISCIPLINE) return of(null);

    const project = this.project;
    const nodes = this.store.selectSnapshot(ProjectState.nodes)!;
    const nodeViews = this.currentNodeViews(state);
    const results = this.processors.run(
      project.categories.phase,
      this.copy(nodes),
      this.copy(nodeViews!),
      action.rows,
      true
    );

    return ctx.dispatch(new SaveUpload(results));
  }

  private copy<T>(x: T): T {
    return <T>JSON.parse(JSON.stringify(x));
  }

  private currentNodeViews(state: StateModel): WbsNodeView[] {
    return (
      this.store.selectSnapshot(
        state.viewNode === PROJECT_NODE_VIEW.DISCIPLINE
          ? ProjectState.disciplines
          : ProjectState.phases
      ) ?? []
    );
  }
}
