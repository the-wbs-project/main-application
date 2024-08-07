import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  faArrowUpFromBracket,
  faCheck,
  faX,
} from '@fortawesome/pro-solid-svg-icons';
import { Navigate, RouterState } from '@ngxs/router-plugin';
import { gearIcon } from '@progress/kendo-svg-icons';
import { WatchIndicatorComponent } from '@wbs/components/watch-indicator.component';
import { LibraryEntry, NavigationLink, SaveState } from '@wbs/core/models';
import {
  NavigationMenuService,
  SignalStore,
  TitleService,
} from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { ActionIconListComponent } from '@wbs/components/_utils/action-icon-list.component';
import { NavigationComponent } from '@wbs/components/_utils/navigation.component';
import { PageHeaderComponent } from '@wbs/components/page-header';
import { EntryStore } from '@wbs/core/store';
import { delay, tap } from 'rxjs/operators';
import { EntryActionButtonComponent } from './components/entry-action-button.component';
import { EntryTitleComponent } from './components/entry-title';
import { ENTRY_NAVIGATION } from './models';
import { EntryViewBreadcrumbsPipe } from './pipes/entry-view-breadcrumbs.pipe';

@Component({
  standalone: true,
  templateUrl: './view-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ActionIconListComponent,
    EntryActionButtonComponent,
    EntryTitleComponent,
    EntryViewBreadcrumbsPipe,
    NavigationComponent,
    PageHeaderComponent,
    SaveMessageComponent,
    RouterModule,
    WatchIndicatorComponent,
  ],
})
export class EntryViewComponent {
  private readonly navService = inject(NavigationMenuService);
  private readonly entryService = inject(EntryService);
  private readonly store = inject(SignalStore);

  readonly entryStore = inject(EntryStore);
  readonly owner = input.required<string>();
  readonly entryId = input.required<string>();
  readonly entryUrl = input.required<string[]>();

  readonly url = this.store.select(RouterState.url);
  readonly titleSaveState = signal<SaveState>('ready');
  readonly links = computed(() =>
    this.filterSettings(
      this.navService.processLinks(
        ENTRY_NAVIGATION,
        this.entryStore.version()?.status === 'draft',
        this.entryStore.claims()
      ),
      this.entryStore.entry()
    )
  );
  readonly canEditTitle = computed(
    () => !(this.url()?.includes('/settings/') ?? false)
  );

  readonly faArrowUpFromBracket = faArrowUpFromBracket;
  readonly faX = faX;
  readonly gearIcon = gearIcon;
  readonly checkIcon = faCheck;

  constructor(title: TitleService) {
    effect(() => {
      const version = this.entryStore.version();

      title.setTitle([
        { text: 'General.Library' },
        ...(version ? [version.title] : []),
      ]);
    });
  }

  titleChanged(title: string): void {
    this.titleSaveState.set('saving');

    this.entryService
      .titleChangedAsync(title)
      .pipe(
        tap(() => this.titleSaveState.set('saved')),
        delay(5000)
      )
      .subscribe(() => this.titleSaveState.set('ready'));
  }

  navigate(route: string[]) {
    this.store.dispatch(new Navigate([...this.entryUrl(), ...route]));
  }

  filterSettings(
    list: NavigationLink[],
    entry: LibraryEntry | undefined
  ): NavigationLink[] {
    if (!entry) return [];

    list = structuredClone(list);

    const settings = list.find((l) => l.section === 'settings');

    if (!settings) return list;

    if (entry.type === 'project') {
      settings.items = settings.items?.filter((x) => x.section !== 'phase');
    } else if (entry.type === 'phase') {
      settings.items = settings.items?.filter((x) => x.section !== 'phases');
    } else {
      settings.items = settings.items?.filter(
        (x) => x.section !== 'phase' && x.section !== 'phases'
      );
    }

    return list;
  }
}
