import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { faArrowUpFromBracket, faX } from '@fortawesome/pro-solid-svg-icons';
import { Navigate, RouterState } from '@ngxs/router-plugin';
import { gearIcon } from '@progress/kendo-svg-icons';
import { SignalStore, TitleService } from '@wbs/core/services';
import { ActionIconListComponent } from '@wbs/main/components/action-icon-list.component';
import { NavigationComponent } from '@wbs/main/components/navigation.component';
import { PageHeaderComponent } from '@wbs/main/components/page-header2';
import { UiState } from '@wbs/main/states';
import { EntryActionButtonComponent } from './components/entry-action-button.component';
import { EntryTitleComponent } from './components/entry-title';
import { ENTRY_NAVIGATION } from './models';
import { EntryViewBreadcrumbsPipe } from './pipes/entry-view-breadcrumbs.pipe';
import { EntryService } from './services';
import { EntryViewState } from './states';
import { NavigationMenuService } from '@wbs/main/services';
import { NavigationLink } from '@wbs/main/models';
import { LibraryEntry } from '@wbs/core/models';

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
    RouterModule,
  ],
})
export class EntryViewComponent {
  private readonly store = inject(SignalStore);
  private readonly navService = inject(NavigationMenuService);
  private readonly entryService = inject(EntryService);

  readonly claims = input.required<string[]>();
  readonly entryUrl = input.required<string[]>();

  readonly url = this.store.select(RouterState.url);
  readonly entry = this.store.select(EntryViewState.entry);
  readonly version = this.store.select(EntryViewState.version);
  readonly activeSubSection = this.store.select(UiState.activeSubSection);
  readonly title = computed(() => this.version()?.title ?? '');
  readonly links = computed(() =>
    this.filterSettings(
      this.navService.processLinks(ENTRY_NAVIGATION, this.claims()),
      this.entry()!
    )
  );
  readonly canEditTitle = computed(
    () => !(this.url()?.includes('/settings/') ?? false)
  );

  readonly faArrowUpFromBracket = faArrowUpFromBracket;
  readonly faX = faX;
  readonly gearIcon = gearIcon;

  constructor(title: TitleService) {
    title.setTitle('Project', false);
  }

  titleChanged(title: string): void {
    this.entryService.titleChangedAsync(title).subscribe();
  }

  navigate(route: string[]) {
    this.store.dispatch(new Navigate([...this.entryUrl(), ...route]));
  }

  filterSettings(
    list: NavigationLink[],
    entry: LibraryEntry
  ): NavigationLink[] {
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
