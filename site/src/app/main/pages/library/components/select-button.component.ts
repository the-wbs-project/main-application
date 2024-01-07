import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-select-button',
  template: ` @if (selected) {
    <button type="button" class="btn btn-dark">
      {{ selectedText | translate }} &nbsp; <fa-icon [icon]="faCheck" />
    </button>
    } @else {
    <button type="button" class="btn btn-outline-dark" (click)="clicked.emit()">
      {{ selectText | translate }}
    </button>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, TranslateModule],
})
export class SelectButtonComponent {
  @Input({ required: true }) selected!: boolean;
  @Input() selectText = 'General.Select';
  @Input() selectedText = 'General.Selected';
  @Output() readonly clicked = new EventEmitter<void>();

  readonly faCheck = faCheck;
}
