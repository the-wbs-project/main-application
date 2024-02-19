import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LIBRARY_ENTRY_TYPES,
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
} from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { Transformers } from '@wbs/main/services';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TasksChanged,
  SetEntry,
  VerifyEntry,
  VersionChanged,
  VerifyTask,
  SetTask,
} from '../actions';

interface StateModel {
  entry?: LibraryEntry;
  version?: LibraryEntryVersion;
  tasks?: LibraryEntryNode[];
  taskVms?: WbsNodeView[];
  task?: LibraryEntryNode;
  taskVm?: WbsNodeView;
}

declare type Context = StateContext<StateModel>;

@Injectable()
@State<StateModel>({
  name: 'entryState',
  defaults: {},
})
export class EntryViewState {
  private readonly data = inject(DataServiceFactory);
  private readonly transformer = inject(Transformers);

  @Selector()
  static entry(state: StateModel): LibraryEntry | undefined {
    return state.entry;
  }

  @Selector()
  static tasks(state: StateModel): LibraryEntryNode[] | undefined {
    return state.tasks;
  }

  @Selector()
  static taskVms(state: StateModel): WbsNodeView[] | undefined {
    return state.taskVms;
  }

  @Selector()
  static task(state: StateModel): LibraryEntryNode | undefined {
    return state.task;
  }

  @Selector()
  static taskVm(state: StateModel): WbsNodeView | undefined {
    return state.taskVm;
  }

  @Selector()
  static version(state: StateModel): LibraryEntryVersion | undefined {
    return state.version;
  }

  @Action(VerifyEntry)
  verifyEntry(
    ctx: Context,
    { owner, entryId, versionId }: VerifyEntry
  ): Observable<void> | void {
    const state = ctx.getState();

    if (
      state.entry?.id === entryId &&
      state.version?.entryId === entryId &&
      state.version?.version === versionId &&
      (state.tasks?.length ?? 0) > 0
    )
      return;

    return ctx.dispatch(new SetEntry(owner, entryId, versionId));
  }

  @Action(SetEntry)
  setEntry(
    ctx: Context,
    { owner, entryId, versionId }: SetEntry
  ): Observable<void> {
    return forkJoin({
      entry: this.data.libraryEntries.getAsync(owner, entryId),
      version: this.data.libraryEntryVersions.getAsync(
        owner,
        entryId,
        versionId
      ),
      tasks: this.data.libraryEntryNodes.getAllAsync(owner, entryId, versionId),
    }).pipe(
      map(({ entry, version, tasks }) => {
        ctx.patchState({
          entry,
          version,
          tasks,
          taskVms: this.transformer.nodes.phase.view.run(
            tasks,
            entry.type === LIBRARY_ENTRY_TYPES.TASK ? undefined : version.phases
          ),
        });
      })
    );
  }

  @Action(VerifyTask)
  verifyTask(ctx: Context, { taskId }: VerifyTask): Observable<void> | void {
    const state = ctx.getState();

    if (state.task?.id === taskId) return;

    return ctx.dispatch(new SetTask(taskId));
  }

  @Action(SetTask)
  setTask(ctx: Context, { taskId }: SetTask): void {
    const state = ctx.getState();
    const task = state.tasks?.find((x) => x.id === taskId);
    const taskVm = state.taskVms?.find((x) => x.id === taskId);

    ctx.patchState({ task, taskVm });
  }

  @Action(VersionChanged)
  versionChanged(ctx: Context, { version }: VersionChanged): void {
    ctx.patchState({ version });
  }

  @Action(TasksChanged)
  tasksChanged(ctx: Context, { upserts, removeIds }: TasksChanged): void {
    const list = structuredClone(ctx.getState().tasks ?? []);

    if (removeIds)
      for (const id of removeIds) {
        const index = list.findIndex((x) => x.id === id);

        if (index > -1) list.splice(index, 1);
      }

    for (const node of upserts) {
      const index = list.findIndex((x) => x.id === node.id);

      if (index === -1) list.push(node);
      else list[index] = node;
    }

    ctx.patchState({ tasks: list });
  }
}