import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate, RouterState } from '@ngxs/router-plugin';
import { ActionIconListComponent } from '@wbs/components/_utils/action-icon-list.component';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { ActionButtonComponent2 } from '@wbs/components/action-button2';
import { PageHeaderComponent } from '@wbs/components/page-header';
import { WatchIndicatorComponent } from '@wbs/components/watch-indicator.component';
import { SaveService, SignalStore, TitleService } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { EntryStore } from '@wbs/core/store';
import { EntryViewBreadcrumbsPipe } from './pipes/entry-view-breadcrumbs.pipe';
import { EntryActionButtonService } from './services';

@Component({
  standalone: true,
  templateUrl: './view-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ActionButtonComponent2,
    ActionIconListComponent,
    EntryViewBreadcrumbsPipe,
    PageHeaderComponent,
    SaveMessageComponent,
    RouterModule,
    TranslateModule,
    WatchIndicatorComponent,
  ],
})
export class EntryViewComponent {
  private readonly entryService = inject(EntryService);
  private readonly store = inject(SignalStore);

  readonly entryStore = inject(EntryStore);
  readonly menuService = inject(EntryActionButtonService);
  readonly owner = input.required<string>();
  readonly entryUrl = input.required<string[]>();

  readonly url = this.store.select(RouterState.url);
  readonly titleSaveState = new SaveService();
  readonly canWatch = computed(() =>
    (this.entryStore.versions() ?? []).some((x) => x.status === 'published')
  );
  readonly menu = computed(() =>
    this.menuService.buildMenu(
      this.entryStore.versions()!,
      this.entryStore.version()!,
      this.entryUrl(),
      this.entryStore.claims()
    )
  );
  readonly pageLabel = computed(() => {
    const version = this.entryStore.version()!;
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
      const version = this.entryStore.version();

      title.setTitle([
        { text: 'General.Library' },
        ...(version ? [version.title] : []),
      ]);
    });
  }

  titleChanged(title: string): void {
    this.titleSaveState
      .call(this.entryService.titleChangedAsync(title))
      .subscribe();
  }

  navigate(route: string[]) {
    this.store.dispatch(new Navigate([...this.entryUrl(), ...route]));
  }
}
