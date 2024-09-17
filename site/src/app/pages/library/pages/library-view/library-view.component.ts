import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RouterState } from '@ngxs/router-plugin';
import { LoadingComponent } from '@wbs/components/_utils/loading.component';
import { ActionButtonComponent } from '@wbs/components/action-button';
import { WatchIndicatorComponent } from '@wbs/components/watch-indicator.component';
import { DataServiceFactory } from '@wbs/core/data-services';
import { SignalStore, TitleService, Utils } from '@wbs/core/services';
import { EntryStore } from '@wbs/core/store';
import { TextTransformPipe } from '@wbs/pipes/text-transform.pipe';
import { switchMap } from 'rxjs/operators';
import { LibraryActionService } from './services';

@Component({
  standalone: true,
  templateUrl: './library-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ActionButtonComponent,
    LoadingComponent,
    RouterModule,
    TextTransformPipe,
    TranslateModule,
    WatchIndicatorComponent,
  ],
})
export class LibraryViewComponent implements OnInit {
  private readonly data = inject(DataServiceFactory);
  private readonly store2 = inject(SignalStore);
  readonly actions = inject(LibraryActionService);
  readonly store = inject(EntryStore);
  readonly route = inject(ActivatedRoute);
  readonly recordId = Utils.getParam(this.route.snapshot, 'recordId');
  //
  //  Inputs
  //
  readonly entryUrl = input.required<string[]>();
  //
  //  Signal
  //
  readonly loaded = signal(true);
  readonly url = this.store2.select(RouterState.url);
  //
  //  Computed
  //
  readonly canWatch = computed(() =>
    (this.store.versions() ?? []).some((x) => x.status === 'published')
  );
  readonly menu = computed(() =>
    this.actions.buildMenu(
      this.store.versions()!,
      this.store.version()!,
      this.entryUrl(),
      this.store.claims()
    )
  );
  readonly pageLabel = computed(() => {
    const version = this.store.version()!;
    const url = this.url()?.split('/') ?? [];
    const index = url.indexOf(version.entryId);
    const page = url[index + 2];

    return page === 'tasks'
      ? 'General.Tasks'
      : page === 'resources'
      ? 'General.Resources'
      : undefined;
  });

  constructor(title: TitleService) {
    effect(() => {
      const version = this.store.version();

      title.setTitle([
        { text: 'General.Library' },
        ...(version ? [version.title] : []),
      ]);
    });
  }

  ngOnInit(): void {
    const route = this.route.snapshot;
    const org = Utils.getParam(route, 'org');
    const owner = Utils.getParam(route, 'ownerId');
    const versionId = parseInt(Utils.getParam(route, 'versionId'), 10);

    if (!owner || !this.recordId || !versionId || isNaN(versionId)) return;

    const visibility = org === owner ? 'private' : 'public';

    this.data.libraryEntries
      .getIdAsync(owner, this.recordId)
      .pipe(
        switchMap((entryId) =>
          this.data.libraryEntries.getVersionByIdAsync(
            owner,
            entryId,
            versionId,
            visibility
          )
        )
      )
      .subscribe(({ versions, version, tasks, claims }) => {
        this.store.setAll(versions, version, tasks, claims);
        this.loaded.set(false);
      });
  }
}
