import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  Action,
  NgxsOnInit,
  Selector,
  State,
  StateContext,
  Store,
} from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ChatComment, ProjectApproval } from '@wbs/core/models';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  ApprovalChanged,
  InitiateApprovals,
  SendApprovalMessage,
  SetApproval,
} from '../actions';
import { ProjectState } from './project.state';
import { Message } from '@progress/kendo-angular-conversational-ui';

interface StateModel {
  current?: ProjectApproval;
  list?: ProjectApproval[];
  messages?: Message[];
  owner?: string;
  started: boolean;
}
declare type Context = StateContext<StateModel>;

@Injectable()
@UntilDestroy()
@State<StateModel>({
  name: 'projectApproval',
  defaults: {
    started: false,
  },
})
export class ProjectApprovalState implements NgxsOnInit {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly store: Store
  ) {}

  @Selector()
  static current(state: StateModel): ProjectApproval | undefined {
    return state.current;
  }

  @Selector()
  static list(state: StateModel): ProjectApproval[] | undefined {
    return state.list;
  }

  @Selector()
  static messages(state: StateModel): Message[] | undefined {
    return state.messages;
  }

  @Selector()
  static started(state: StateModel): boolean {
    return state.started;
  }

  ngxsOnInit(ctx: Context): void {
    const sub = this.store
      .select(ProjectState.current)
      .pipe(untilDestroyed(this))
      .subscribe((project) => {
        if (!project) return;

        const state = ctx.getState();
        //
        //  If we're already started, and the project is still started, do nothing.
        //
        if (state.started === project.approvalStarted) return;

        ctx.patchState({
          started: project.approvalStarted,
          owner: project.owner,
        });

        if (project.approvalStarted) {
          ctx.dispatch(new InitiateApprovals(project.owner, project.id));
          sub.unsubscribe();
        }
      });
  }

  @Action(InitiateApprovals)
  initiateApprovals(
    ctx: Context,
    { owner, projectId }: InitiateApprovals
  ): Observable<void> {
    return this.data.projectApprovals.getAllAsync(owner, projectId).pipe(
      map((list) => {
        ctx.patchState({ list });
      })
    );
  }

  @Action(SetApproval)
  setApproval(
    ctx: Context,
    { approval }: SetApproval
  ): void | Observable<void> {
    ctx.patchState({ current: approval });

    if (!approval) {
      ctx.patchState({ messages: undefined });
      return;
    }

    return this.data.chat.getPageAsync(this.getThreadId(ctx), 0, 100).pipe(
      map((messages) => {
        for (const m of messages) m.status = 'Written by ' + m.author.name;
        ctx.patchState({ messages });
      })
    );
  }

  @Action(ApprovalChanged)
  approvalChanged(
    ctx: Context,
    { isApproved }: ApprovalChanged
  ): Observable<void> {
    const state = ctx.getState();
    const current = structuredClone(state.current!);

    current.isApproved = isApproved;

    return this.data.projectApprovals
      .putAsync(state.owner!, current.projectId, current)
      .pipe(
        tap(() => {
          const index = state.list!.findIndex((a) => a.id === current.id);
          state.list![index] = current;

          ctx.patchState({ current, list: [...state.list!] });
        })
      );
  }

  @Action(SendApprovalMessage)
  sendApprovalMessage(
    ctx: Context,
    { author, message }: SendApprovalMessage
  ): Observable<void> {
    const messageObj: ChatComment = {
      author,
      text: message,
      threadId: this.getThreadId(ctx),
      timestamp: new Date(),
    };

    return this.data.chat.insertAsync(messageObj).pipe(
      map((newMessage) => {
        const state = ctx.getState();

        newMessage.status = 'Written by ' + newMessage.author.name;
        ctx.patchState({
          messages: [...structuredClone(state.messages ?? []), newMessage],
        });
      })
    );
  }

  private getThreadId(ctx: Context): string {
    const state = ctx.getState();

    return `approval|${state.current?.projectId}|${state.current?.id}`;
  }
}
