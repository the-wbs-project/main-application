import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { PageHeaderComponent } from '@wbs/main/components';
import { ProjectUploadState } from './states';

@Component({
  standalone: true,
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
  imports: [CommonModule, PageHeaderComponent, RouterModule, TranslateModule],
})
export class ProjectUploadLayoutComponent {
  readonly project = toSignal(this.store.select(ProjectUploadState.current));
  readonly title = toSignal(this.store.select(ProjectUploadState.pageTitle));

  constructor(private readonly store: Store) {}
}
