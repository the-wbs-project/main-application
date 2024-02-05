import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-select-button',
  template: `@if (selected()) {
    <button type="button" class="btn btn-dark" [ngClass]="buttonClass()">
      {{ selectedText() | translate }} &nbsp; <fa-icon [icon]="faCheck" />
    </button>
    } @else {
    <button
      type="button"
      class="btn btn-outline-dark"
      [ngClass]="buttonClass()"
      (click)="clicked.emit()"
    >
      {{ selectText() | translate }}
    </button>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass, TranslateModule],
})
export class SelectButtonComponent {
  readonly faCheck = faCheck;
  readonly selected = input<boolean>(false);
  readonly selectText = input<string>('General.Select');
  readonly selectedText = input<string>('General.Selected');
  readonly buttonClass = input<string>();
  @Output() readonly clicked = new EventEmitter<void>();
}
