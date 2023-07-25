import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { NavBack } from '../../actions';

@Component({
  standalone: true,
  selector: 'wbs-project-create-footer',
  templateUrl: './footer.component.html',
  imports: [CommonModule, TranslateModule]
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
