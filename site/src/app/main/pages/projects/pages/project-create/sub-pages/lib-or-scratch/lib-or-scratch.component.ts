import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faBooks, faChalkboardUser } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer';
import { LibOrScratchChosen } from '../../actions';

@Component({
  standalone: true,
  selector: 'wbs-project-create-lib-or-scratch',
  templateUrl: './lib-or-scratch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, WizardFooterComponent],
})
export class LibOrScratchComponent {
  readonly faBooks = faBooks;
  readonly faChalkboardUser = faChalkboardUser;

  constructor(private readonly store: Store) {}

  lib(): void {
    this.store.dispatch(new LibOrScratchChosen(true));
  }

  scratch(): void {
    this.store.dispatch(new LibOrScratchChosen(false));
  }
}
