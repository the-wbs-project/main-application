import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RouterState } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { PROJECT_SETTINGS_NAVIGATION } from '../../../models';

@Component({
  standalone: true,
  templateUrl: './project-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, RouterModule, TranslateModule],
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

    return PROJECT_SETTINGS_NAVIGATION.find((x) => x.fragment === fragment)
      ?.title;
  }
}
