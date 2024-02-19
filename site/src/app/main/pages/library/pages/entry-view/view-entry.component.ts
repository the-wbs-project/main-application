import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { faArrowUpFromBracket, faX } from '@fortawesome/pro-solid-svg-icons';
import { Navigate } from '@ngxs/router-plugin';
import { gearIcon } from '@progress/kendo-svg-icons';
import { SignalStore, TitleService } from '@wbs/core/services';
import { ActionIconListComponent } from '@wbs/main/components/action-icon-list.component';
import { NavigationComponent } from '@wbs/main/components/navigation.component';
import { PageHeaderComponent } from '@wbs/main/components/page-header2';
import { NavMenuProcessPipe } from '@wbs/main/pipes/nav-menu-process.pipe';
import { UiState } from '@wbs/main/states';
import { EntryActionButtonComponent } from './components/entry-action-button.component';
import { EntryTitleComponent } from './components/entry-title';
import { ENTRY_NAVIGATION } from './models';
import { EntryViewBreadcrumbsPipe } from './pipes/entry-view-breadcrumbs.pipe';
import { EntryService } from './services';
import { EntryViewState } from './states';

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
    NavMenuProcessPipe,
    PageHeaderComponent,
    RouterModule,
  ],
})
export class EntryViewComponent {
  private readonly store = inject(SignalStore);
  private readonly entryService = inject(EntryService);

  readonly claims = input.required<string[]>();
  readonly userId = input.required<string>();
  readonly owner = input.required<string>();

  readonly entry = this.store.select(EntryViewState.entry);
  readonly version = this.store.select(EntryViewState.version);
  readonly activeSubSection = this.store.select(UiState.activeSubSection);
  readonly title = computed(() => this.version()?.title ?? '');

  readonly links = ENTRY_NAVIGATION;
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
    this.store.dispatch(
      new Navigate([
        '/' + this.owner(),
        'library',
        'view',
        this.entry()!.id,
        this.version()!.version,
        ...route,
      ])
    );
  }
}
