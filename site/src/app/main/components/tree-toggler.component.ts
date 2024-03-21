import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronsLeft,
  faChevronsRight,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-tree-toggler',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, TranslateModule],
  host: { class: 'w-100' },
  template: ` <div
    role="group"
    class="btn-group btn-group-sm"
    aria-label="Collapse/Expand Tasks"
  >
    <button
      type="button"
      class="btn btn-outline-dark pd-x-15 pd-y-1"
      (click)="collapse.emit()"
    >
      <fa-icon [icon]="faChevronsLeft" />
    </button>
    <button
      type="button"
      class="btn btn-outline-dark pd-x-15 pd-y-1"
      (click)="expand.emit()"
    >
      <fa-icon [icon]="faChevronsRight" />
    </button>
  </div>`,
})
export class TreeTogglerComponent {
  collapse = output<void>();
  expand = output<void>();

  readonly faChevronsLeft = faChevronsLeft;
  readonly faChevronsRight = faChevronsRight;
}
