import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  Project,
  ProjectCategory,
  PROJECT_FILTER,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
} from '@wbs/core/models';
import { DialogService, Messages } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { Observable, of, switchMap } from 'rxjs';
import {
  ChangeProjectDisciplines,
  ChangeProjectPhases,
  SaveUpload,
} from '../../actions';
import { ProjectState } from '../../states';
import { ProjectCategoryDialogComponent } from './components';
import { PAGE_VIEW, PAGE_VIEW_TYPE } from './models';
import {
  DownloadNodes,
  EditDisciplines,
  EditPhases,
  ProjectPageChanged,
  UploadNodes,
} from './project-view.actions';
import { PhaseExtractProcessor } from './services';

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

    return this.data.projectExport.runAsync(
      this.project,
      'xlsx',
      this.currentNodeViews(state)
    );
  }

  @Action(UploadNodes)
  uploadNodes(ctx: StateContext<StateModel>): void | Observable<any> {
    const state = ctx.getState();

    /*
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
    );*/
  }

  @Action(EditPhases)
  editPhases(ctx: StateContext<StateModel>): Observable<any> {
    const project = this.store.selectSnapshot(ProjectState.current)!;

    return this.dialog
      .openDialog<ProjectCategory[] | undefined>(
        ProjectCategoryDialogComponent,
        {
          title: 'General.Phases',
          categoryType: PROJECT_NODE_VIEW.PHASE,
          categories: project.categories.phase,
        }
      )
      .pipe(
        switchMap((result) =>
          result ? ctx.dispatch(new ChangeProjectPhases(result)) : of(null)
        )
      );
  }

  @Action(EditDisciplines)
  editDisciplines(ctx: StateContext<StateModel>): Observable<any> {
    const project = this.store.selectSnapshot(ProjectState.current)!;

    return this.dialog
      .openDialog<ProjectCategory[] | undefined>(
        ProjectCategoryDialogComponent,
        {
          title: 'General.Phases',
          categoryType: PROJECT_NODE_VIEW.DISCIPLINE,
          categories: project.categories.discipline,
        }
      )
      .pipe(
        switchMap((result) =>
          result ? ctx.dispatch(new ChangeProjectDisciplines(result)) : of(null)
        )
      );
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
