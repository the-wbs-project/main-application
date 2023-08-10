import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  ListItem,
  Project,
  ProjectNode,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  PROJECT_SCOPE_TYPE,
  PROJECT_STATI,
} from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { MetadataState } from '@wbs/main/states';
import { Observable, switchMap } from 'rxjs';
import {
  CategoryChosen,
  DisciplinesChosen,
  GoToBasics,
  LibOrScratchChosen,
  NavBack,
  NodeViewChosen,
  PhasesChosen,
  SaveProject,
  StartWizard,
  SubmitBasics,
} from '../actions';
import {
  ProjectCreationPage,
  PROJECT_CREATION_PAGES as PAGES,
} from '../models';

interface StateModel {
  category?: string;
  description: string;
  disciplines?: (string | ListItem)[];
  isSaving: boolean;
  nodeView?: PROJECT_NODE_VIEW_TYPE;
  owner?: string;
  page?: ProjectCreationPage;
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
  static category(state: StateModel): string | undefined {
    return state.category;
  }

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
  static page(state: StateModel): ProjectCreationPage | undefined {
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
  startWizard(ctx: StateContext<StateModel>, { owner }: StartWizard): void {
    ctx.patchState({
      owner,
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
    } else if (current === PAGES.CATEGORY) {
      ctx.patchState({
        page: PAGES.BASICS,
      });
    } else if (current === PAGES.LIB_OR_SCRATCH) {
      ctx.patchState({
        page: PAGES.CATEGORY,
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
      page: PAGES.CATEGORY,
      description: action.description,
      title: action.title,
    });
  }

  @Action(CategoryChosen)
  categoryChosen(ctx: StateContext<StateModel>, action: CategoryChosen): void {
    ctx.patchState({
      page: PAGES.LIB_OR_SCRATCH,
      category: action.category,
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
      page: save ? undefined : PAGES.DESCIPLINES,
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
      page: save ? undefined : PAGES.PHASES,
      disciplines: action.disciplines,
    });

    if (save) return ctx.dispatch(new SaveProject());
  }

  @Action(SaveProject)
  saveProject(ctx: StateContext<StateModel>): Observable<void> | void {
    ctx.patchState({
      isSaving: true,
    });

    const catsPhases = this.store.selectSnapshot(MetadataState.phases);
    const catsDiscipline = this.store.selectSnapshot(MetadataState.disciplines);
    const state = ctx.getState();
    const phases = state.phases!;
    const disciplines = state.disciplines!;
    const now = Date.now();
    const project: Project = {
      id: IdService.generate(),
      owner: state.owner!,
      createdBy: '',
      categories: {
        discipline: disciplines,
        phase: phases,
      },
      category: state.category!,
      description: state.description,
      mainNodeView: state.nodeView!,
      roles: [],
      status: PROJECT_STATI.PLANNING,
      title: state.title,
      createdOn: now,
      lastModified: now,
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
          createdOn: now,
          lastModified: now,
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
          createdOn: now,
          lastModified: now,
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
          createdOn: now,
          lastModified: now,
        });
      } else {
        nodes.push({
          description: discipline.description,
          id: discipline.id,
          order: i + 1,
          parentId: null,
          projectId: project.id,
          title: discipline.label,
          createdOn: now,
          lastModified: now,
        });
      }
    }
    const url = ['/projects', 'view', project.id, 'about'];

    return this.data.projects.putAsync(project).pipe(
      switchMap(() =>
        this.data.projectNodes.batchAsync(project.owner, project.id, nodes, [])
      ),
      switchMap(() => ctx.dispatch(new Navigate(url)))
    );
  }
}
