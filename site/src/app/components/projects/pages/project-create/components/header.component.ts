//project-create
import { Component, Input } from '@angular/core';
import { PROJECT_CREATION_PAGES_TYPE } from '../models';

@Component({
  selector: 'app-project-create-header',
  template: `<div class="pd-t-30">
    <p class="tx-24">{{ page | projectCreateTitle }}</p>
    <p>{{ page | projectCreateDescription }}</p>
  </div>`,
})
export class HeaderComponent {
  @Input() page: PROJECT_CREATION_PAGES_TYPE | null | undefined;
}
