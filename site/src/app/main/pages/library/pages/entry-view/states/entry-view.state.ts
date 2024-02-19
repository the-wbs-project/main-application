import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
} from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { Observable, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  TasksChanged,
  SetEntry,
  VerifyEntry,
  VersionChanged,
} from '../actions';

interface StateModel {
  entry?: LibraryEntry;
  version?: LibraryEntryVersion;
  tasks?: LibraryEntryNode[];
}

declare type Context = StateContext<StateModel>;

@Injectable()
@State<StateModel>({
  name: 'entryState',
  defaults: {},
})
export class EntryViewState {
  private readonly data = inject(DataServiceFactory);
  private readonly messaging = inject(Messages);

  @Selector()
  static entry(state: StateModel): LibraryEntry | undefined {
    return state.entry;
  }

  @Selector()
  static tasks(state: StateModel): LibraryEntryNode[] | undefined {
    return state.tasks;
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
        ctx.patchState({ entry, version, tasks });
      })
      //tap((project) => ctx.dispatch([new VerifyTasks(project)])),
    );
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

  private saveVersion(
    ctx: Context,
    owner: string,
    version: LibraryEntryVersion,
    message: string
  ): Observable<void> {
    return this.data.libraryEntryVersions.putAsync(owner, version).pipe(
      tap(() => this.messaging.notify.success(message, false)),
      tap(() => ctx.patchState({ version }))
    );
  }
}
