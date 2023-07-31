import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterState } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { PROJECT_SETTINGS_PAGE_LISTS } from '../../models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  templateUrl: './project-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, TranslateModule],
})
export class ProjectSettingsComponent {
  private readonly url = toSignal(this.store.select(RouterState.url));

  readonly title = computed(() => this.getPage(this.url()));

  constructor(private readonly store: Store) {}

  private getPage(url: string | undefined): string | undefined {
    if (!url) return '';

    const parts = url.split('/');
    const parentIndex = parts.indexOf('settings');
    const fragment = parts[parentIndex + 1];

    return PROJECT_SETTINGS_PAGE_LISTS.find((x) => x.fragment === fragment)
      ?.title;
  }
}
