import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
  AddUsers,
  CreateThread,
  EditThread,
  LoadDiscussionForum,
  LoadPosts,
} from '@wbs/main/states';
import { IdService, Messages } from '@wbs/core/services';
import { sorter } from '@wbs/main/services';
import { AuthState } from '@wbs/main/states';
import { Observable, forkJoin } from 'rxjs';
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
  static posts(state: StateModel): Discussion[] | undefined {
    return state.posts;
  }

  @Selector()
  static thread(state: StateModel): Discussion | undefined {
    return state.threads.find((x) => x.id === state.threadId);
  }

  @Selector()
  static threadTextUrl(state: StateModel): string | undefined {
    return state.threadId
      ? `/api/discussions/${state.organization}/${state.associationId}/${state.threadId}/text`
      : undefined;
  }

  //

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

    return forkJoin({
      threads: this.data.getAsync(action.organization, action.associationId),
      users: this.data.getUsersAsync(action.organization, action.associationId),
    }).pipe(
      tap(({ users }) => ctx.dispatch(new AddUsers(users))),
      map(({ threads }) => {
        ctx.patchState({
          threads: sort(threads),
          organization: action.organization,
          associationId: action.associationId,
        });
      })
    );
  }

  @Action(LoadPosts)
  loadPosts(
    ctx: StateContext<StateModel>,
    action: LoadPosts
  ): Observable<void> | void {
    const state = ctx.getState();

    if (
      !state.organization ||
      !state.associationId ||
      state.threadId === action.threadId
    )
      return;

    return this.data
      .getAsync(state.organization, state.associationId, action.threadId)
      .pipe(
        map((threads) => {
          ctx.patchState({
            posts: sort(threads),
            threadId: action.threadId,
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
  list.sort((a, b) => sorter(a.lastUpdated, b.lastUpdated));
