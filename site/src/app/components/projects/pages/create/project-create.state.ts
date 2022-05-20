import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  Project,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  PROJECT_SCOPE_TYPE,
} from '@wbs/shared/models';
import { DataServiceFactory, Messages } from '@wbs/shared/services';
import {
  DisciplinesChosen,
  GoToBasics,
  LibOrScratchChosen,
  NavBack,
  NodeViewChosen,
  PhasesChosen,
  SaveProject,
  StartWizard,
  SubmitBasics,
  SubmitScope,
} from './project-create.actions';
import {
  PROJECT_CREATION_PAGES as PAGES,
  PROJECT_CREATION_PAGES_TYPE,
} from './models';
import { Observable } from 'rxjs';

interface StateModel {
  disciplineIds?: string[];
  nodeView?: PROJECT_NODE_VIEW_TYPE;
  page?: PROJECT_CREATION_PAGES_TYPE;
  phaseIds?: string[];
  scope?: PROJECT_SCOPE_TYPE;
  title: string;
  useLibrary?: boolean;
}

@Injectable()
@State<StateModel>({
  name: 'projectCreate',
  defaults: {
    title: '',
  },
})
export class ProjectCreateState {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly messages: Messages
  ) {}

  @Selector()
  static disciplineIds(state: StateModel): string[] | undefined {
    return state.disciplineIds;
  }

  @Selector()
  static nodeView(state: StateModel): PROJECT_NODE_VIEW_TYPE | undefined {
    return state.nodeView;
  }

  @Selector()
  static page(state: StateModel): PROJECT_CREATION_PAGES_TYPE | undefined {
    return state.page;
  }

  @Selector()
  static phaseIds(state: StateModel): string[] | undefined {
    return state.phaseIds;
  }

  @Selector()
  static scope(state: StateModel): PROJECT_SCOPE_TYPE | undefined {
    return state.scope;
  }

  @Selector()
  static title(state: StateModel): string | undefined {
    return state.title;
  }

  @Action(StartWizard)
  startWizard(ctx: StateContext<StateModel>): void {
    ctx.patchState({
      page: PAGES.GETTING_STARTED,
      title: '',
    });
  }

  @Action(NavBack)
  navBack(ctx: StateContext<StateModel>): void {
    const current = ctx.getState().page!;
    ctx.patchState({
      page:
        current == 2
          ? PAGES.GETTING_STARTED
          : current == 3
          ? PAGES.BASICS
          : current == 4
          ? PAGES.SCOPE
          : PAGES.LIB_OR_SCRATCH,
    });
  }

  @Action(GoToBasics)
  goToBasics(ctx: StateContext<StateModel>): void {
    ctx.patchState({
      page: PAGES.BASICS,
    });
  }

  @Action(SubmitBasics)
  submitBasics(ctx: StateContext<StateModel>, action: SubmitBasics): void {
    ctx.patchState({
      page: PAGES.SCOPE,
      title: action.title,
    });
  }

  @Action(SubmitScope)
  submitScope(ctx: StateContext<StateModel>, action: SubmitScope): void {
    ctx.patchState({
      page: PAGES.LIB_OR_SCRATCH,
      scope: action.scope,
    });
  }

  @Action(LibOrScratchChosen)
  libOrScratchChosen(
    ctx: StateContext<StateModel>,
    action: LibOrScratchChosen
  ): void {
    ctx.patchState({
      page: action.useLibrary ? PAGES.DESCIPLINES : PAGES.NODE_VIEW,
      useLibrary: action.useLibrary,
    });
  }

  @Action(NodeViewChosen)
  nodeViewChosen(ctx: StateContext<StateModel>, action: NodeViewChosen): void {
    ctx.patchState({
      page:
        action.nodeView === PROJECT_NODE_VIEW.DISCIPLINE
          ? PAGES.DESCIPLINES
          : PAGES.PHASES,
      nodeView: action.nodeView,
    });
  }

  @Action(PhasesChosen)
  phasesChosen(
    ctx: StateContext<StateModel>,
    action: PhasesChosen
  ): void | Observable<void> {
    const state = ctx.getState();
    const save = state.nodeView === PROJECT_NODE_VIEW.DISCIPLINE;

    ctx.patchState({
      page: save ? PAGES.SAVING : PAGES.DESCIPLINES,
      phaseIds: action.phaseIds,
    });

    if (save) return ctx.dispatch(new SaveProject());
  }

  @Action(DisciplinesChosen)
  disciplinesChosen(
    ctx: StateContext<StateModel>,
    action: DisciplinesChosen
  ): void | Observable<void> {
    const state = ctx.getState();
    const save = state.nodeView === PROJECT_NODE_VIEW.PHASE;

    ctx.patchState({
      page: save ? PAGES.SAVING : PAGES.PHASES,
      disciplineIds: action.disciplineIds,
    });

    if (save) return ctx.dispatch(new SaveProject());
  }

  @Action(SaveProject)
  saveProject(ctx: StateContext<StateModel>): Observable<void> {
    const state = ctx.getState();

    return ctx.dispatch(new SaveProject());
  }
}
