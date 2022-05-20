import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faBooks, faChalkboardUser } from '@fortawesome/pro-duotone-svg-icons';
import { Store } from '@ngxs/store';
import { LibOrScratchChosen } from '../../../project-create.actions';

@Component({
  selector: 'app-project-create-lib-or-scratch',
  templateUrl: './lib-or-scratch.component.html',
  styleUrls: ['./lib-or-scratch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
