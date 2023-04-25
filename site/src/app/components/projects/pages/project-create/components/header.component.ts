//project-create
import { Component, Input } from '@angular/core';
import { ProjectCreationPage } from '../models';

@Component({
  selector: 'wbs-project-create-header',
  template: `<div class="pd-t-30">
    <p class="tx-24">{{ page?.title ?? '' | translate }}</p>
    <p>{{ page?.description ?? '' | translate }}</p>
  </div>`,
})
export class HeaderComponent {
  @Input() page: ProjectCreationPage | null | undefined;
}
