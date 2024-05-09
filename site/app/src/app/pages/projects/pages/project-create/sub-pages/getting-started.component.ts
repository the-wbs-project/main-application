import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PROJECT_CREATION_PAGES } from '../models';
import { ProjectCreateService } from '../services';

@Component({
  standalone: true,
  template: `<div class="w-100 tx-center pd-t-40">
    <button class="btn btn-primary" (click)="continue()">
      {{ 'General.Continue' | translate }}
    </button>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
})
export class GettingStartedComponent {
  readonly org = input.required<string>();

  constructor(private readonly service: ProjectCreateService) {}

  continue() {
    this.service.nav(this.org(), PROJECT_CREATION_PAGES.BASICS);
  }
}
