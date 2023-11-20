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
import { Message } from '@progress/kendo-angular-conversational-ui';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  ChatComment,
  ProjectApproval,
  ProjectApprovalSaveRecord,
} from '@wbs/core/models';
import { ProjectApprovalStats } from '@wbs/main/models';
import { AuthState } from '@wbs/main/states';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  ApprovalChanged,
  InitiateApprovals,
  SendApprovalMessage,
  SetApproval,
  SetApprovalView,
} from '../actions';
import { ProjectState } from './project.state';

interface StateModel {
  childrenIds?: string[];
  current?: ProjectApproval;
  list: ProjectApproval[];
  stats?: ProjectApprovalStats;
  messages?: Message[];
  owner?: string;
  projectId?: string;
  started: boolean;
  view: 'project' | 'task';
}
declare type Context = StateContext<StateModel>;

@Injectable()
@UntilDestroy()
@State<StateModel>({
  name: 'projectApproval',
  defaults: {
    list: [],
    started: false,
    view: 'project',
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
  static hasChildren(state: StateModel): boolean {
    return (state.childrenIds ?? []).length > 0;
  }

  @Selector()
  static list(state: StateModel): ProjectApproval[] {
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

  @Selector()
  static view(state: StateModel): 'project' | 'task' {
    return state.view;
  }

  @Selector()
  static stats(state: StateModel): ProjectApprovalStats | undefined {
    return state.stats;
  }

  ngxsOnInit(ctx: Context): void {
    this.store
      .select(ProjectState.current)
      .pipe(untilDestroyed(this))
      .subscribe((project) => {
        if (!project) return;

        const state = ctx.getState();
        //
        //  If we're already started, and the project is still started, do nothing.
        //
        if (
          state.owner === project.owner &&
          state.projectId === project.id &&
          state.started === project.approvalStarted
        )
          return;

        ctx.patchState({
          started: project.approvalStarted,
          owner: project.owner,
          projectId: project.id,
          childrenIds: undefined,
          current: undefined,
          list: [],
          messages: undefined,
          stats: undefined,
        });

        if (project.approvalStarted) {
          ctx.dispatch(new InitiateApprovals(project.owner, project.id));
        }
      });
  }

  @Action(InitiateApprovals)
  initiateApprovals(
    ctx: Context,
    { owner, projectId }: InitiateApprovals
  ): Observable<any> {
    return this.data.projectApprovals.getAllAsync(owner, projectId).pipe(
      tap((list) => ctx.patchState({ list })),
      tap(() => this.runStats(ctx))
    );
  }

  @Action(SetApproval)
  setApproval(
    ctx: Context,
    { approval, childrenIds }: SetApproval
  ): void | Observable<void> {
    ctx.patchState({ current: approval, childrenIds });

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

  @Action(SetApprovalView)
  setApprovalView(ctx: Context, { view }: SetApprovalView): void {
    ctx.patchState({ view, current: undefined, childrenIds: undefined });
  }

  @Action(ApprovalChanged)
  approvalChanged(
    ctx: Context,
    { isApproved, childrenToo }: ApprovalChanged
  ): Observable<void> {
    const state = ctx.getState();
    const record: ProjectApprovalSaveRecord = {
      isApproved,
      projectId: state.projectId!,
      ids: [state.current!.id],
      approvedBy: this.store.selectSnapshot(AuthState.userId)!,
      approvedOn: new Date(),
    };

    if (childrenToo) record.ids.push(...state.childrenIds!);

    return this.data.projectApprovals
      .putAsync(state.owner!, record.projectId, record)
      .pipe(
        map(() => {
          for (const id of record.ids) {
            const index = state.list.findIndex((x) => x.id === id);

            if (index === -1) continue;

            state.list[index] = {
              id,
              projectId: record.projectId,
              isApproved: record.isApproved,
              approvedBy: record.approvedBy,
              approvedOn: record.approvedOn,
            };
          }

          ctx.patchState({
            current: {
              id: state.current!.id,
              projectId: record.projectId,
              isApproved: record.isApproved,
              approvedBy: record.approvedBy,
              approvedOn: record.approvedOn,
            },
            list: state.list,
          });
        }),
        tap(() => this.runStats(ctx))
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

  private runStats(ctx: Context): void {
    const list = [...ctx.getState().list.values()];
    const total = list.length;
    const approved = list.filter((a) => a.isApproved === true).length;
    const rejected = list.filter((a) => a.isApproved === false).length;
    const remaining = list.filter((a) => a.isApproved == undefined).length;

    ctx.patchState({
      stats: {
        approved,
        approvedPercent: Math.round((approved / total) * 100),
        rejected,
        rejectedPercent: Math.round((rejected / total) * 100),
        remaining,
        remainingPercent: Math.round((remaining / total) * 100),
        total,
      },
    });
  }
}
