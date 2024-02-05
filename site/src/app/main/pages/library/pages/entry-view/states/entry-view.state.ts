import { Injectable } from '@angular/core';
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
  NodesChanged,
  SetEntry,
  TitleChanged,
  VerifyEntry,
} from '../actions';

interface StateModel {
  entry?: LibraryEntry;
  version?: LibraryEntryVersion;
  nodes?: LibraryEntryNode[];
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
  static nodes(state: StateModel): LibraryEntryNode[] | undefined {
    return state.nodes;
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

  @Action(NodesChanged)
  nodesChanged(
    ctx: Context,
    { upserts, removeIds }: NodesChanged
  ): Observable<void> {
    const state = ctx.getState();
    const entry = state.entry!;
    const version = state.version!.version;

    return this.data.libraryEntryNodes
      .putAsync(entry.owner, entry.id, version, upserts, removeIds)
      .pipe(
        tap(() => this.messaging.notify.success('Saving!', false)),
        tap(() => {
          const nodes = structuredClone(state.nodes!);

          for (const id of removeIds) {
            const index = nodes.findIndex((x) => x.id === id);

            if (index > -1) nodes.splice(index, 1);
          }

          for (const node of upserts) {
            const index = nodes.findIndex((x) => x.id === node.id);

            if (index === -1) nodes.push(node);
            else nodes[index] = node;
          }
          ctx.patchState({ nodes });
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
