import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { faArrowUpFromBracket } from '@fortawesome/pro-solid-svg-icons';
import { RouterState } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { TitleService } from '@wbs/core/services';
import { PROJECT_MENU_ITEMS } from './models';
import { ProjectState } from './states';

@Component({
  templateUrl: './project-view-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectViewLayoutComponent {
  private readonly url = toSignal(this.store.select(RouterState.url));
  private readonly project = toSignal(this.store.select(ProjectState.current));

  readonly links = PROJECT_MENU_ITEMS.projectLinks;
  readonly faArrowUpFromBracket = faArrowUpFromBracket;
  readonly canSubmit = toSignal(this.store.select(ProjectState.canSubmit));
  readonly pageView = computed(() => this.getPage(this.url()));
  readonly category = computed(() => this.project()?.category);
  readonly title = computed(() => this.project()?.title);

  constructor(title: TitleService, private readonly store: Store) {
    title.setTitle('Project', false);
  }

  private getPage(url: string | undefined): string {
    if (!url) return '';

    const parts = url.split('/');
    const parentIndex = parts.indexOf('view');

    return parts[parentIndex + 2];
  }
}
