import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionMenuItem } from '../models';

@Component({
  selector: 'wbs-action-buttons',
  template: `<div class="btn-group" kendoTooltip filter="button[title]">
    <button
      type="button"
      *ngFor="let item of items"
      class="btn btn-white btn-outline-primary"
      (click)="actionClicked.emit(item.action)"
      [title]="item.tooltip ?? '' | translate"
    >
      <fa-icon *ngIf="item.icon" [icon]="item.icon"></fa-icon>
      <span *ngIf="showTitle && item.title">
        {{ item.title | translate }}
      </span>
    </button>
  </div>`,
})
export class ActionButtonsComponent {
  @Input() items?: ActionMenuItem[] | null;
  @Input() showTitle = true;
  @Output() readonly actionClicked = new EventEmitter<string>();
}
