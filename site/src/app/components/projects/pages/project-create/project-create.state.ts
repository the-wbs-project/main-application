import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
  ListItem,
  Project,
  ProjectNode,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  PROJECT_SCOPE_TYPE,
  PROJECT_STATI,
} from '@wbs/shared/models';
import { DataServiceFactory, IdService, Messages } from '@wbs/shared/services';
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
} from './project-create.actions';
import {
  PROJECT_CREATION_PAGES as PAGES,
  PROJECT_CREATION_PAGES_TYPE,
} from './models';
import { Observable, switchMap } from 'rxjs';
import { MetadataState } from '@wbs/shared/states';
import { Navigate } from '@ngxs/router-plugin';

interface StateModel {
  description: string;
  disciplines?: (string | ListItem)[];
  isSaving: boolean;
  nodeView?: PROJECT_NODE_VIEW_TYPE;
  page?: PROJECT_CREATION_PAGES_TYPE;
  phases?: (string | ListItem)[];
  scope?: PROJECT_SCOPE_TYPE;
  title: string;
  useLibrary?: boolean;
}

@Injectable()
@State<StateModel>({
  name: 'projectCreate',
  defaults: {
    description: '',
    isSaving: false,
    title: '',
  },
})
export class ProjectCreateState {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly store: Store
  ) {}

  @Selector()
  static description(state: StateModel): string {
    return state.description;
  }

  @Selector()
  static disciplines(state: StateModel): (string | ListItem)[] | undefined {
    return state.disciplines;
  }

  @Selector()
  static isSaving(state: StateModel): boolean {
    return state.isSaving;
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
  static phases(state: StateModel): (string | ListItem)[] | undefined {
    return state.phases;
  }

  @Selector()
  static scope(state: StateModel): PROJECT_SCOPE_TYPE | undefined {
    return state.scope;
  }

  @Selector()
  static title(state: StateModel): string {
    return state.title;
  }

  @Action(StartWizard)
  startWizard(ctx: StateContext<StateModel>): void {
    ctx.patchState({
      page: PAGES.GETTING_STARTED,
      description: '',
      title: '',
    });
  }

  @Action(NavBack)
  navBack(ctx: StateContext<StateModel>): void {
    const state = ctx.getState();
    const current = state.page!;

    if (current === PAGES.BASICS) {
      ctx.patchState({
        page: PAGES.GETTING_STARTED,
      });
    } else if (current === PAGES.LIB_OR_SCRATCH) {
      ctx.patchState({
        page: PAGES.BASICS,
      });
    } else if (current === PAGES.NODE_VIEW) {
      ctx.patchState({
        page: state.useLibrary ? PAGES.DESCIPLINES : PAGES.LIB_OR_SCRATCH,
      });
    } else if (current === PAGES.PHASES) {
      ctx.patchState({
        page:
          state.nodeView === PROJECT_NODE_VIEW.PHASE
            ? PAGES.NODE_VIEW
            : PAGES.DESCIPLINES,
      });
    } else if (current === PAGES.DESCIPLINES) {
      ctx.patchState({
        page:
          state.nodeView === PROJECT_NODE_VIEW.DISCIPLINE
            ? PAGES.NODE_VIEW
            : PAGES.PHASES,
      });
    }
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
      page: PAGES.LIB_OR_SCRATCH,
      description: action.description,
      title: action.title,
    });
  }

  @Action(LibOrScratchChosen)
  libOrScratchChosen(
    ctx: StateContext<StateModel>,
    action: LibOrScratchChosen
  ): void {
    ctx.patchState({
      page: PAGES.NODE_VIEW,
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
      phases: action.phases,
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
      disciplines: action.disciplines,
    });

    if (save) return ctx.dispatch(new SaveProject());
  }

  @Action(SaveProject)
  saveProject(ctx: StateContext<StateModel>): Observable<void> | void {
    ctx.patchState({
      isSaving: true,
    });

    const catsPhases = this.store.selectSnapshot(MetadataState.phaseCategories);
    const catsDiscipline = this.store.selectSnapshot(
      MetadataState.disciplineCategories
    );
    const state = ctx.getState();
    const phases = state.phases!;
    const disciplines = state.disciplines!;

    const project: Project = {
      id: IdService.generate(),
      categories: {
        discipline: disciplines,
        phase: phases,
      },
      description: state.description,
      mainNodeView: state.nodeView!,
      status: PROJECT_STATI.PLANNING,
      title: state.title,
      _ts: new Date().getTime(),
    };
    const nodes: ProjectNode[] = [];

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];

      if (typeof phase === 'string') {
        const cat = catsPhases.find((x) => x.id === phase)!;

        nodes.push({
          description: cat.description,
          discipline: [],
          disciplineIds: [],
          id: cat.id,
          order: i + 1,
          parentId: null,
          phase: {
            isDisciplineNode: false,
            syncWithDisciplines: false,
          },
          projectId: project.id,
          title: cat.label,
          _ts: new Date().getTime(),
        });
      } else {
        nodes.push({
          description: phase.description,
          discipline: [],
          disciplineIds: [],
          id: phase.id,
          order: i + 1,
          parentId: null,
          phase: {
            isDisciplineNode: false,
            syncWithDisciplines: false,
          },
          projectId: project.id,
          title: phase.label,
          _ts: new Date().getTime(),
        });
      }
    }

    for (let i = 0; i < disciplines.length; i++) {
      const discipline = disciplines[i];

      if (typeof discipline === 'string') {
        const cat = catsDiscipline.find((x) => x.id === discipline)!;

        nodes.push({
          description: cat.description,
          id: cat.id,
          order: i + 1,
          parentId: null,
          projectId: project.id,
          title: cat.label,
          _ts: new Date().getTime(),
        });
      } else {
        nodes.push({
          description: discipline.description,
          id: discipline.id,
          order: i + 1,
          parentId: null,
          projectId: project.id,
          title: discipline.label,
          _ts: new Date().getTime(),
        });
      }
    }
    const url = ['/projects', project.id, 'view'];

    return this.data.projects.putAsync(project).pipe(
      switchMap(() => this.data.projectNodes.batchAsync(project.id, nodes, [])),
      switchMap(() => ctx.dispatch(new Navigate(url)))
    );
  }
}
