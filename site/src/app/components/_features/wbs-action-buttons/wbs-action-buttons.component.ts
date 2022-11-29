import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ActionMenuItem } from '@wbs/core/models';

@Component({
  selector: 'wbs-action-buttons',
  template: `<div class="btn-group">
    <button
      type="button"
      *ngFor="let item of items"
      class="btn btn-white btn-outline-primary"
      (click)="clicked.emit(item.action)"
      [ngbTooltip]="item.tooltip ?? '' | translate"
      container="body"
    >
      <fa-icon *ngIf="item.icon" [icon]="item.icon"></fa-icon>
      <span *ngIf="showTitle && item.title">
        {{ item.title | translate }}
      </span>
    </button>
  </div>`,
})
export class WbsActionButtonsComponent {
  @Input() items?: ActionMenuItem[] | null;
  @Input() showTitle = true;
  @Output() readonly clicked = new EventEmitter<string>();
}
