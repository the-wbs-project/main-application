import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-select-button',
  template: `@if (selected()) {
    <button kendoButton themeColor="dark" [ngClass]="buttonClass()">
      {{ selectedText() | translate }}
    </button>
    } @else {
    <button kendoButton [ngClass]="buttonClass()" (click)="clicked.emit()">
      {{ selectText() | translate }}
    </button>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, NgClass, TranslateModule],
})
export class SelectButtonComponent {
  readonly selected = input<boolean>(false);
  readonly selectText = input<string>('General.Select');
  readonly selectedText = input<string>('General.Selected');
  readonly buttonClass = input<string>();
  readonly clicked = output<void>();
}
