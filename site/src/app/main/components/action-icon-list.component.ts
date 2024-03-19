import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonFillMode,
  ButtonSize,
  DropDownButtonModule,
} from '@progress/kendo-angular-buttons';
import { ActionMenuItem } from '@wbs/core/models';
import { KendoToFaSizePipe } from '../pipes/kendo-to-fa-size.pipe';

@Component({
  standalone: true,
  selector: 'wbs-action-icon-list',
  template: `<kendo-dropdownbutton
    [fillMode]="fillMode()"
    [size]="size()"
    [data]="menuItems"
    buttonClass="tx-8 pd-0-f"
    [popupSettings]="{ align: align() }"
    (itemClick)="clicked($event)"
  >
    <fa-icon [icon]="mainIcon()" size="xl" />
    <ng-template kendoDropDownButtonItemTemplate let-dataItem>
      <div class="lh-10" [ngClass]="dataItem.cssClasses">
        @if (dataItem.icon) {
        <fa-icon [icon]="dataItem.icon" />
        <span class="mg-l-10"> {{ dataItem.text | translate }} </span>
        } @else {
        {{ dataItem.text | translate }}
        }
      </div>
    </ng-template>
  </kendo-dropdownbutton>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DropDownButtonModule,
    FontAwesomeModule,
    KendoToFaSizePipe,
    NgClass,
    TranslateModule,
  ],
})
export class ActionIconListComponent {
  readonly align = input<'left' | 'right' | 'center'>();
  readonly size = input.required<ButtonSize>();
  readonly fillMode = input.required<ButtonFillMode>();
  readonly mainIcon = input.required<IconDefinition>();
  readonly menuItems = input.required<ActionMenuItem[]>();
  readonly itemClicked = output<string>();

  clicked(item: ActionMenuItem): void {
    if (item.disabled) return;

    this.itemClicked.emit(item.action);
  }
}
