import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterState } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { SETTINGS_PAGE_LISTS } from '../../../models';

@Component({
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSettingsComponent {
  readonly pageTitle$ = this.store
    .select(RouterState.url)
    .pipe(map(this.getPage));

  constructor(private readonly store: Store) {}

  private getPage(url: string | undefined): string | undefined {
    if (!url) return '';

    const parts = url.split('/');
    const parentIndex = parts.indexOf('settings');
    const fragment = parts[parentIndex + 1];

    return SETTINGS_PAGE_LISTS.find((x) => x.fragment === fragment)?.title;
  }
}
