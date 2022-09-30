//project-create
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { NavBack } from '../../project-create.actions';

@Component({
  selector: 'app-project-create-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  @Input() view?: string;
  @Input() showContinue = false;
  @Input() disableBack = false;
  @Input() disableContinue = false;
  @Output() readonly continueClicked = new EventEmitter<void>();

  constructor(private readonly store: Store) {}

  back(): void {
    this.store.dispatch(new NavBack());
  }
}
