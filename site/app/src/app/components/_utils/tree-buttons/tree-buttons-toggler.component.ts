import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronsLeft,
  faChevronsRight,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-tree-buttons-toggler',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonGroupModule,
    ButtonModule,
    FontAwesomeModule,
    TranslateModule,
  ],
  template: `<kendo-buttongroup size="small">
    <button kendoButton size="small" (click)="collapse.emit()">
      <fa-icon [icon]="faChevronsLeft" class="mg-r-5" />
      {{ 'Wbs.CollapseAll' | translate }}
    </button>
    <button kendoButton size="small" (click)="expand.emit()">
      {{ 'Wbs.ExpandAll' | translate }}
      <fa-icon [icon]="faChevronsRight" class="mg-l-5" />
    </button>
  </kendo-buttongroup>`,
})
export class TreeButtonsTogglerComponent {
  collapse = output<void>();
  expand = output<void>();

  readonly faChevronsLeft = faChevronsLeft;
  readonly faChevronsRight = faChevronsRight;
}
