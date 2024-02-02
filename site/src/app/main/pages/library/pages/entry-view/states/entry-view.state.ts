import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntry, LibraryEntryVersion } from '@wbs/core/models';
import { Messages, Resources } from '@wbs/core/services';
import { Observable, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  DescriptionChanged,
  SetEntry,
  TitleChanged,
  VerifyEntry,
} from '../actions';

interface StateModel {
  entry?: LibraryEntry;
  version?: LibraryEntryVersion;
}

declare type Context = StateContext<StateModel>;

@Injectable()
@State<StateModel>({
  name: 'entryState',
  defaults: {},
})
export class EntryViewState {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly messaging: Messages,
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  @Selector()
  static entry(state: StateModel): LibraryEntry | undefined {
    return state.entry;
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
  titleChanged(ctx: Context, { title }: TitleChanged): Observable<void> | void {
    const state = ctx.getState();
    const entry = state.entry!;
    const version = structuredClone(state.version!);
    version.title = title;

    return this.data.libraryEntryVersions.putAsync(entry.owner, version).pipe(
      tap(() => this.messaging.notify.success('SAVED!', false)),
      tap(() => ctx.patchState({ version }))
    );
  }

  @Action(DescriptionChanged)
  descriptionChanged(
    ctx: Context,
    { description }: DescriptionChanged
  ): Observable<void> | void {
    const state = ctx.getState();
    const entry = state.entry!;
    const version = structuredClone(state.version!);
    version.description = description;

    return this.data.libraryEntryVersions.putAsync(entry.owner, version).pipe(
      tap(() => this.messaging.notify.success('SAVED!', false)),
      tap(() => ctx.patchState({ version }))
    );
  }
}
