import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ActionMenuItem } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-action-buttons',
  template: `<div class="btn-group">
    <button
      type="button"
      *ngFor="let item of items"
      class="btn btn-white btn-outline-primary"
      (click)="clicked.emit(item.action)"
      placement="bottom"
    >
      <fa-icon *ngIf="item.icon" [icon]="item.icon" />
      <span *ngIf="showTitle && item.text">
        {{ item.text | translate }}
      </span>
    </button>
  </div>`,
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
})
export class WbsActionButtonsComponent {
  @Input() items?: ActionMenuItem[] | null;
  @Input() showTitle = true;
  @Output() readonly clicked = new EventEmitter<string>();
}
