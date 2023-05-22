import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { ProjectUploadState } from './states';

@Component({
  template: `<wbs-page-header
      *ngIf="project(); let project"
      [title]="title() ?? '' | translate"
      [items]="[
        { route: ['/projects', 'list', 'my'], label: 'General.Projects' },
        { route: ['/projects', project.id, 'view'], label: project.title }
      ]"
      [active_item]="'General.Upload' | translate"
    />
    <div class="mg-t-40">
      <router-outlet />
    </div>`,
})
export class ProjectUploadLayoutComponent {
  readonly project = toSignal(this.store.select(ProjectUploadState.current));
  readonly title = toSignal(this.store.select(ProjectUploadState.pageTitle));

  constructor(private readonly store: Store) {}
}
