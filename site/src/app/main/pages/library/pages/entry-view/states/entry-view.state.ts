import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntry, LibraryEntryVersion } from '@wbs/core/models';
import { Messages, Resources } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SetEntry, VerifyEntry } from '../actions';

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
    { owner, entryId }: VerifyEntry
  ): Observable<void> | void {
    const state = ctx.getState();

    if (state.entry?.id === entryId) return;

    return ctx.dispatch(new SetEntry(owner, entryId));
  }

  @Action(SetEntry)
  setEntry(ctx: Context, { owner, entryId }: SetEntry): Observable<void> {
    return this.data.libraryEntries.getAsync(owner, entryId).pipe(
      map((entry) => {
        ctx.patchState({ entry });
      })
      //tap((project) => ctx.dispatch([new VerifyTasks(project)])),
    );
  }
}
