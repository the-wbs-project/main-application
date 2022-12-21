import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DiscussionService } from '@wbs/core/services';
import { DiscussionViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadProjectDiscussion } from '../actions';

interface StateModel {
  organization?: string;
  threadId?: string;
  discussions?: DiscussionViewModel[];
}

@Injectable()
@State<StateModel>({
  name: 'projectDiscussion',
  defaults: {},
})
export class ProjectDiscussionState {
  constructor(private readonly service: DiscussionService) {}

  @Selector()
  static discussions(state: StateModel): DiscussionViewModel[] | undefined {
    return state.discussions;
  }

  @Action(LoadProjectDiscussion)
  loadProjectDiscussion(
    ctx: StateContext<StateModel>,
    action: LoadProjectDiscussion
  ): Observable<void> | void {
    const state = ctx.getState();

    if (
      state.organization === action.organization &&
      state.threadId === action.threadId
    )
      return;

    return this.service.build(action.organization, action.threadId).pipe(
      map((discussions) => {
        ctx.patchState({
          discussions,
          organization: action.organization,
          threadId: action.threadId,
        });
      })
    );
  }
}
