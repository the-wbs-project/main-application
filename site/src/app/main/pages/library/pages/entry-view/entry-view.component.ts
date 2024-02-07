import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { faArrowUpFromBracket, faX } from '@fortawesome/pro-solid-svg-icons';
import { gearIcon } from '@progress/kendo-svg-icons';
import { SignalStore, TitleService } from '@wbs/core/services';
import { ActionIconListComponent } from '@wbs/main/components/action-icon-list.component';
import { NavigationComponent } from '@wbs/main/components/navigation.component';
import { PageHeaderComponent } from '@wbs/main/components/page-header2';
import { NavMenuProcessPipe } from '@wbs/main/pipes/nav-menu-process.pipe';
import { EntryActionButtonComponent } from './components/entry-action-button.component';
import { EntryTitleComponent } from './components/entry-title';
import { ENTRY_NAVIGATION } from './models';
import { EntryViewState } from './states';
import { TitleChanged } from './actions';
import { EntryViewBreadcrumbsPipe } from './pipes/entry-view-breadcrumbs.pipe';
import { Navigate } from '@ngxs/router-plugin';
import { UiState } from '@wbs/main/states';

@Component({
  standalone: true,
  templateUrl: './entry-view.component.html',
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

  constructor(title: TitleService, private readonly store: SignalStore) {
    title.setTitle('Project', false);
  }

  titleChanged(title: string): void {
    this.store.dispatch(new TitleChanged(title));
  }

  navigate(route: string[]) {
    //acme_engineering/library/view/tpObVhGM8N/1/about
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
