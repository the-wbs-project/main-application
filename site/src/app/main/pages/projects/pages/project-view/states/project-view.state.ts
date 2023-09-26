import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  Project,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
} from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { DownloadNodes, ProjectPageChanged } from '../actions';
import { PROJECT_PAGE_VIEW } from '../models';
import { ProjectState, TasksState } from '../states';

interface StateModel {
  viewNode?: PROJECT_NODE_VIEW_TYPE;
}

@Injectable()
@State<StateModel>({
  name: 'projectView',
  defaults: {},
})
export class ProjectViewState {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly messages: Messages,
    private readonly store: Store
  ) {}

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
      viewNode:
        action.view === PROJECT_PAGE_VIEW.PHASES
          ? PROJECT_NODE_VIEW.PHASE
          : action.view === PROJECT_PAGE_VIEW.DISCIPLINES
          ? PROJECT_NODE_VIEW.DISCIPLINE
          : undefined,
    });
  }

  @Action(DownloadNodes)
  downloadNodes(ctx: StateContext<StateModel>): Observable<void> {
    const state = ctx.getState();

    this.messages.notify.info('General.RetrievingData');

    return this.data.projectExport.runAsync(
      this.project,
      'xlsx',
      this.currentNodeViews(state)
    );
  }

  private currentNodeViews(state: StateModel): WbsNodeView[] {
    return (
      this.store.selectSnapshot(
        state.viewNode === PROJECT_NODE_VIEW.DISCIPLINE
          ? TasksState.disciplines
          : TasksState.phases
      ) ?? []
    );
  }
}
