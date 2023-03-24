import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { LoadDiscussionForum } from '@wbs/core/actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Discussion } from '../models';
import { DiscussionDataService } from '../services';

interface StateModel {
  organization?: string;
  associateId?: string;
  threadId?: string;
  threads?: Discussion[];
  posts?: Discussion[];
}

@Injectable()
@State<StateModel>({
  name: 'forum',
  defaults: {},
})
export class DiscussionForumState {
  constructor(private readonly data: DiscussionDataService) {}

  @Selector()
  static threads(state: StateModel): Discussion[] | undefined {
    return state.threads;
  }

  @Action(LoadDiscussionForum)
  loadDiscussionForum(
    ctx: StateContext<StateModel>,
    action: LoadDiscussionForum
  ): Observable<void> | void {
    const state = ctx.getState();

    if (
      state.organization === action.organization &&
      state.associateId === action.associateId
    )
      return;

    return this.data.getAsync(action.organization, action.associateId).pipe(
      map((threads) => {
        ctx.patchState({
          threads,
          organization: action.organization,
          associateId: action.associateId,
        });
      })
    );
  }
}
