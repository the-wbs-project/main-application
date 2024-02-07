import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LibraryEntry,
  LibraryEntryNode,
  LibraryEntryVersion,
} from '@wbs/core/models';
import { Messages, Resources } from '@wbs/core/services';
import { Observable, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  DescriptionChanged,
  TasksChanged,
  PhasesChanged,
  SetEntry,
  TitleChanged,
  VerifyEntry,
  VerifyEntryTasks,
} from '../actions';
import { EntryTaskService } from '../services';

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
  private readonly entryService = inject(EntryTaskService);
  private readonly messaging = inject(Messages);
  private readonly resources = inject(Resources);
  private readonly store: Store = inject(Store);

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
      state.version?.version === versionId
    )
      return;

    return ctx.dispatch(new SetEntry(owner, entryId, versionId));
  }

  @Action(VerifyEntryTasks)
  verifyEntryTasks(ctx: Context): Observable<void> | void {
    const state = ctx.getState();

    if (!state.entry || !state.version || (state.tasks ?? []).length > 0)
      return;

    return this.data.libraryEntryNodes
      .getAllAsync(state.entry.owner, state.entry.id, state.version.version)
      .pipe(
        map((tasks) => {
          ctx.patchState({ tasks });
        })
      );
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
    }).pipe(
      map(({ entry, version }) => {
        ctx.patchState({ entry, version });
      })
      //tap((project) => ctx.dispatch([new VerifyTasks(project)])),
    );
  }

  @Action(TitleChanged)
  titleChanged(ctx: Context, { title }: TitleChanged): Observable<void> {
    const state = ctx.getState();
    const entry = state.entry!;
    const version = structuredClone(state.version!);
    version.title = title;

    return this.saveVersion(ctx, entry.owner, version, 'SAVED!');
  }

  @Action(DescriptionChanged)
  descriptionChanged(
    ctx: Context,
    { description }: DescriptionChanged
  ): Observable<void> {
    const state = ctx.getState();
    const entry = state.entry!;
    const version = structuredClone(state.version!);
    version.description = description;

    return this.saveVersion(ctx, entry.owner, version, 'SAVED!');
  }

  @Action(PhasesChanged)
  phasesChanged(ctx: Context, { phases }: PhasesChanged): Observable<void> {
    const state = ctx.getState();
    const entry = state.entry!;
    const version = structuredClone(state.version!);
    version.phases = phases;

    return this.saveVersion(ctx, entry.owner, version, 'SAVED!');
  }

  @Action(TasksChanged)
  tasksChanged(
    ctx: Context,
    { upserts, removeIds }: TasksChanged
  ): Observable<void> {
    const state = ctx.getState();
    const entry = state.entry!;
    const version = state.version!.version;

    return this.entryService
      .saveAsync(
        entry.owner,
        entry.id,
        version,
        state.tasks ?? [],
        upserts,
        removeIds
      )
      .pipe(
        map((list) => {
          ctx.patchState({ tasks: list });
        })
      );
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
