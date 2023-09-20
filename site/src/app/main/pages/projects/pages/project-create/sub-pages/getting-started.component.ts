import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PROJECT_CREATION_PAGES } from '../models';
import { ProjectCreateService } from '../services';

@Component({
  standalone: true,
  template: `<p>
    <button class="btn btn-primary" (click)="continue()">
      {{ 'General.Continue' | translate }}
    </button>
  </p> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
})
export class GettingStartedComponent {
  @Input() org!: string;

  constructor(private readonly service: ProjectCreateService) {}

  continue() {
    this.service.nav(this.org, PROJECT_CREATION_PAGES.BASICS);
  }
}
