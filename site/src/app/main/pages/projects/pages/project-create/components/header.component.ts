//project-create
import { Component, Input } from '@angular/core';
import { ProjectCreationPage } from '../models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-project-create-header',
  template: `<div class="pd-t-30">
    <p class="tx-24">{{ page?.title ?? '' | translate }}</p>
    <p>{{ page?.description ?? '' | translate }}</p>
  </div>`,
  imports: [TranslateModule]
})
export class HeaderComponent {
  @Input() page: ProjectCreationPage | null | undefined;
}
