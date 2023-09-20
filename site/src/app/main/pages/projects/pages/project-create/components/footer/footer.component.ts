import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-project-create-footer',
  templateUrl: './footer.component.html',
  imports: [CommonModule, TranslateModule],
})
export class FooterComponent {
  @Input() view?: string;
  @Input() showContinue = false;
  @Input() disableBack = false;
  @Input() disableContinue = false;
  @Output() readonly backClicked = new EventEmitter<void>();
  @Output() readonly continueClicked = new EventEmitter<void>();
}
