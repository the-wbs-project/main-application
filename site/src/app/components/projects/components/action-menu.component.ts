import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ActionMenuItem } from '@wbs/shared/models';

@Component({
  selector: 'app-project-action-menu',
  template: `<div ngbDropdown class="d-inline-block">
    <button
      type="button"
      id="actionMenu"
      class="btn btn-primary pd-xs-5"
      ngbDropdownToggle
    >
      <i class="fa-solid fa-cogs"></i>
    </button>
    <div ngbDropdownMenu aria-labelledby="actionMenu">
      <button
        ngbDropdownItem
        *ngFor="let item of menu"
        (click)="itemClicked.emit(item.action)"
      >
        <i *ngIf="item.icon" class="fa-solid" [ngClass]="item.icon"></i> &nbsp;
        {{ item.title ?? '' | translate }}
      </button>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionMenuComponent {
  @Input() menu: ActionMenuItem[] = [];
  @Output() itemClicked = new EventEmitter<string>();
}
