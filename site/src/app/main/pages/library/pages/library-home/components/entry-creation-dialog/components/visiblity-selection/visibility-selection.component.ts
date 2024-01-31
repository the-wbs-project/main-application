import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEarth, faLock } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { SelectButtonComponent } from '@wbs/main/components/select-button.component';

@Component({
  standalone: true,
  selector: 'wbs-visibility-selection',
  templateUrl: './visibility-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass, SelectButtonComponent, TranslateModule],
})
export class VisiblitySelectionComponent {
  @Output() readonly visibilityChange = new EventEmitter<string | undefined>();

  readonly visibility = input.required<string | undefined>();
  readonly faEarth = faEarth;
  readonly faLock = faLock;
}
