import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '@wbs/components/_utils/loading.component';
import { ActionButtonComponent } from '@wbs/components/action-button';
import { WatchIndicatorComponent } from '@wbs/components/watch-indicator.component';
import { DataServiceFactory } from '@wbs/core/data-services';
import { TitleService, Utils } from '@wbs/core/services';
import { TextTransformPipe } from '@wbs/pipes/text-transform.pipe';
import { filter, switchMap } from 'rxjs/operators';
import { LibraryActionService } from './services';
import { LibraryStore } from './store';

@UntilDestroy()
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
export class LibraryViewComponent {
  private readonly data = inject(DataServiceFactory);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly actions = inject(LibraryActionService);
  readonly store = inject(LibraryStore);
  //
  //  Inputs
  //
  readonly entryUrl = input.required<string[]>();
  readonly ownerId = input.required<string>();
  readonly recordId = input.required<string>();
  readonly versionId = input.required<string>();
  //
  //  Signal
  //
  readonly loaded = signal(true);
  readonly pageLabel = signal<string | undefined>(undefined);
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

  constructor(title: TitleService) {
    //
    //  Setup title
    //
    effect(() => {
      const version = this.store.version();

      title.setTitle([
        { text: 'General.Library' },
        ...(version ? [version.title] : []),
      ]);
    });
    //
    //  Setup data
    //
    effect(() => {
      const org = Utils.getParam(this.route.snapshot, 'org');
      const owner = this.ownerId();
      const recordId = this.recordId();
      const versionId = parseInt(this.versionId(), 10);

      if (!owner || !recordId || !versionId || isNaN(versionId)) return;

      this.setupData(org, owner, recordId, versionId);
    });
    //
    //  Setup page label
    //
    this.router.events
      .pipe(
        filter((val) => val instanceof NavigationEnd),
        untilDestroyed(this)
      )
      .subscribe((val: NavigationEnd) => {
        const parts = val.url.split('/');
        this.pageLabel.set(
          parts.includes('tasks') ? 'General.Tasks' : undefined
        );
      });
  }

  private setupData(
    org: string,
    owner: string,
    recordId: string,
    versionId: number
  ) {
    const visibility = org === owner ? 'private' : 'public';

    this.data.libraryEntries
      .getIdAsync(owner, recordId)
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
