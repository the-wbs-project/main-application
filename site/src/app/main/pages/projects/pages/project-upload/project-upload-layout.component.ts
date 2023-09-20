import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { PageHeaderComponent } from '@wbs/main/components/page-header/page-header.component';
import { ProjectUploadState } from './states';

@Component({
  standalone: true,
  template: `<div class="container-fluid mg-y-20">
      <div class="row">
        <div class="col-12">
          <wbs-page-header />
        </div>
      </div>
    </div>
    <div class="mg-t-40">
      <router-outlet />
    </div>`,
  imports: [PageHeaderComponent, RouterModule],
})
export class ProjectUploadLayoutComponent {
  readonly project = toSignal(this.store.select(ProjectUploadState.current));
  readonly title = toSignal(this.store.select(ProjectUploadState.pageTitle));

  constructor(private readonly store: Store) {}
}
