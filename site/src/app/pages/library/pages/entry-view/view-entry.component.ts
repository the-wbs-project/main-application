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
import { RouterState } from '@ngxs/router-plugin';
import { ActionIconListComponent } from '@wbs/components/_utils/action-icon-list.component';
import { ActionButtonComponent } from '@wbs/components/action-button';
import { WatchIndicatorComponent } from '@wbs/components/watch-indicator.component';
import { SignalStore, TitleService } from '@wbs/core/services';
import { EntryStore } from '@wbs/core/store';
import { LibraryActionService } from './services';

@Component({
  standalone: true,
  templateUrl: './view-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ActionButtonComponent,
    ActionIconListComponent,
    RouterModule,
    TranslateModule,
    WatchIndicatorComponent,
  ],
})
export class EntryViewComponent {
  private readonly store = inject(SignalStore);

  readonly actions = inject(LibraryActionService);
  readonly entryStore = inject(EntryStore);
  readonly owner = input.required<string>();
  readonly entryUrl = input.required<string[]>();

  readonly url = this.store.select(RouterState.url);
  readonly canWatch = computed(() =>
    (this.entryStore.versions() ?? []).some((x) => x.status === 'published')
  );
  readonly menu = computed(() =>
    this.actions.buildMenu(
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
}
