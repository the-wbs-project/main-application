import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
  CreateThread,
  EditThread,
  LoadDiscussionForum,
} from '@wbs/core/actions';
import { IdService, Messages } from '@wbs/core/services';
import { AuthState } from '@wbs/core/states';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Discussion } from '../models';
import { DiscussionDataService } from '../services';

interface StateModel {
  organization?: string;
  associationId?: string;
  threadId?: string;
  threads: Discussion[];
  posts?: Discussion[];
}

@Injectable()
@State<StateModel>({
  name: 'forum',
  defaults: {
    threads: [],
  },
})
export class DiscussionForumState {
  constructor(
    private readonly data: DiscussionDataService,
    private readonly messages: Messages,
    private readonly store: Store
  ) {}

  private get userId(): string {
    return this.store.selectSnapshot(AuthState.profile)!.id;
  }

  @Selector()
  static threads(state: StateModel): Discussion[] {
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
      state.associationId === action.associationId
    )
      return;

    return this.data.getAsync(action.organization, action.associationId).pipe(
      map((threads) => {
        ctx.patchState({
          threads: sort(threads),
          organization: action.organization,
          associationId: action.associationId,
        });
      })
    );
  }

  @Action(CreateThread)
  createThread(
    ctx: StateContext<StateModel>,
    action: CreateThread
  ): Observable<void> | void {
    const state = ctx.getState();

    if (!state.organization) return;

    const timestamp = Date.now();
    const thread: Discussion = {
      id: IdService.generate(),
      associationId: state.associationId!,
      title: action.title,
      text: action.message,
      createdOn: timestamp,
      lastUpdated: timestamp,
      writtenBy: this.userId,
      replies: 0,
      promotions: [],
      demotions: [],
    };

    return this.data.putAsync(state.organization, thread).pipe(
      tap(() => ctx.patchState({ threads: [thread, ...state.threads] })),
      tap(() => this.messages.success('General.ThreadCreated'))
    );
  }

  @Action(EditThread)
  editThread(
    ctx: StateContext<StateModel>,
    action: EditThread
  ): Observable<void> | void {
    //
  }
}

const sort = (list: Discussion[]) =>
  list.sort((a, b) => a.lastUpdated - b.lastUpdated);
