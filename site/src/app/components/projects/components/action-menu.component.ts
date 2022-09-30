import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { faCogs } from '@fortawesome/pro-solid-svg-icons';
import { ActionMenuItem } from '@wbs/shared/models';

@Component({
  selector: 'app-project-action-menu',
  template: `<div ngbDropdown class="d-inline-block">
    <button
      type="button"
      id="actionMenu"
      class="btn btn-primary p-2"
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
        <fa-icon *ngIf="item.icon" [icon]="item.icon"></fa-icon> &nbsp;
        {{ item.title ?? '' | translate }}
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
