//project-create
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { faCogs } from '@fortawesome/pro-solid-svg-icons';
import { ActionMenuItem } from '../models';

@Component({
  selector: 'app-project-action-menu',
  template: `<div ngbDropdown class="d-inline-block">
    <button
      type="button"
      class="btn btn-primary p-2"
      id="actionMenu"
      ngbDropdownToggle
    >
      <fa-icon [icon]="faCogs" size="lg"></fa-icon>
    </button>
    <div ngbDropdownMenu aria-labelledby="actionMenu">
      <button
        ngbDropdownItem
        *ngFor="let item of menu"
        (click)="itemClicked.emit(item.action)"
      >
        <fa-icon [icon]="item.icon"></fa-icon>
        {{ item.text | translate }}
      </button>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionMenuComponent {
  @Input() menu: ActionMenuItem[] = [];
  @Output() itemClicked = new EventEmitter<string>();

  readonly faCogs = faCogs;
}
