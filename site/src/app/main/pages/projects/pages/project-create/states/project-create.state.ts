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
  UserRole,
} from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { AuthState, MetadataState } from '@wbs/main/states';
import { Observable, switchMap, tap } from 'rxjs';
import { PROJECT_ACTIONS } from '../../../models';
import {
  CategoryChosen,
  DisciplinesChosen,
  PhasesChosen,
  RolesChosen,
  SaveProject,
  SetHeaderInformation,
  StartWizard,
  SubmitBasics,
} from '../actions';

interface StateModel {
  category?: string;
  description: string;
  disciplines?: (string | ListItem)[];
  headerTitle?: string;
  headerDescription?: string;
  isSaving: boolean;
  isWizardActive: boolean;
  nodeView?: PROJECT_NODE_VIEW_TYPE;
  owner?: string;
  phases?: (string | ListItem)[];
  roles: Map<string, string[]>;
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
    isWizardActive: false,
    roles: new Map<string, string[]>(),
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
  static headerDescription(state: StateModel): string | undefined {
    return state.headerDescription;
  }

  @Selector()
  static headerTitle(state: StateModel): string | undefined {
    return state.headerTitle;
  }

  @Selector()
  static isSaving(state: StateModel): boolean {
    return state.isSaving;
  }

  @Selector()
  static isWizardActive(state: StateModel): boolean {
    return state.isWizardActive;
  }

  @Selector()
  static nodeView(state: StateModel): PROJECT_NODE_VIEW_TYPE | undefined {
    return state.nodeView;
  }

  @Selector()
  static phases(state: StateModel): (string | ListItem)[] | undefined {
    return state.phases;
  }

  @Selector()
  static roles(state: StateModel): Map<string, string[]> {
    return state.roles;
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
      isWizardActive: true,
      description: '',
      roles: new Map<string, string[]>(),
      title: '',
      category: undefined,
      disciplines: undefined,
      phases: undefined,
      isSaving: false,
    });
  }

  @Action(SetHeaderInformation)
  setHeader(
    ctx: StateContext<StateModel>,
    { title, description }: SetHeaderInformation
  ): void {
    ctx.patchState({
      headerDescription: description,
      headerTitle: title,
    });
  }

  @Action(SubmitBasics)
  submitBasics(ctx: StateContext<StateModel>, action: SubmitBasics): void {
    ctx.patchState({
      description: action.description,
      title: action.title,
    });
    console.log('saved');
  }

  @Action(CategoryChosen)
  categoryChosen(ctx: StateContext<StateModel>, action: CategoryChosen): void {
    ctx.patchState({
      //
      //  For now we are going to skip the library page and node view page and go straight to phase first
      //
      //page: PAGES.LIB_OR_SCRATCH,
      category: action.category,
      //
      //  automatically set these values since it isn't a page we are showing right now
      //
      useLibrary: false,
      nodeView: PROJECT_NODE_VIEW.PHASE,
    });
  }

  @Action(PhasesChosen)
  phasesChosen(ctx: StateContext<StateModel>, action: PhasesChosen): void {
    const state = ctx.getState();
    //const save = state.nodeView === PROJECT_NODE_VIEW.DISCIPLINE;

    ctx.patchState({
      phases: action.phases,
    });
  }

  @Action(DisciplinesChosen)
  disciplinesChosen(
    ctx: StateContext<StateModel>,
    action: DisciplinesChosen
  ): void {
    const state = ctx.getState();
    //const save = state.nodeView === PROJECT_NODE_VIEW.PHASE;

    ctx.patchState({
      disciplines: action.disciplines,
    });
  }

  @Action(RolesChosen)
  rolesChosen(
    ctx: StateContext<StateModel>,
    { roles }: RolesChosen
  ): void | Observable<void> {
    ctx.patchState({ roles });

    return ctx.dispatch(new SaveProject());
  }

  @Action(SaveProject)
  saveProject(ctx: StateContext<StateModel>): Observable<any> | void {
    ctx.patchState({
      isSaving: true,
    });

    const catsPhases = this.store.selectSnapshot(MetadataState.phases);
    const catsDiscipline = this.store.selectSnapshot(MetadataState.disciplines);
    const state = ctx.getState();
    const phases = state.phases!;
    const disciplines = state.disciplines!;
    const now = new Date();
    const roles: UserRole[] = [];

    for (const role of state.roles!.keys()) {
      for (const member of state.roles!.get(role)!) {
        roles.push({
          role,
          userId: member,
        });
      }
    }

    const project: Project = {
      id: IdService.generate(),
      owner: state.owner!,
      createdBy: this.getUserId(),
      disciplines,
      phases,
      category: state.category!,
      description: state.description,
      mainNodeView: state.nodeView!,
      roles,
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
          disciplineIds: [],
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
          description: phase.description,
          disciplineIds: [],
          id: phase.id,
          order: i + 1,
          parentId: null,
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
    return this.data.projects.putAsync(project).pipe(
      switchMap(() =>
        this.data.projectNodes.putAsync(project.owner, project.id, nodes, [])
      ),
      switchMap(() =>
        this.data.activities.saveProjectActivitiesAsync(this.getUserId(), [
          {
            data: {
              action: PROJECT_ACTIONS.CREATED,
              topLevelId: project.id,
              data: {
                title: project.title,
                id: project.id,
              },
            },
            project,
            nodes,
          },
        ])
      ),
      tap(() =>
        ctx.patchState({
          isSaving: false,
          isWizardActive: false,
        })
      ),
      tap(() =>
        ctx.dispatch(
          new Navigate([
            '/',
            project.owner,
            'projects',
            'view',
            project.id,
            'about',
          ])
        )
      )
    );
  }

  private getUserId(): string {
    return this.store.selectSnapshot(AuthState.userId)!;
  }
}
