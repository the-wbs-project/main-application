import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonFillMode,
  ButtonSize,
  DropDownButtonModule,
} from '@progress/kendo-angular-buttons';
import { SVGIcon } from '@progress/kendo-angular-icons';
import { IconComponent } from './icon/icon.component';

@Component({
  standalone: true,
  selector: 'wbs-action-icon-list',
  template: `<kendo-dropdownbutton
    [fillMode]="fillMode"
    [size]="size"
    buttonClass="tx-8 pd-0-f"
    [svgIcon]="mainIcon"
    [data]="menuItems"
    [popupSettings]="{ align: align }"
    (itemClick)="itemClicked.emit($event.action)"
  >
    <ng-template kendoDropDownButtonItemTemplate let-dataItem>
      <div class="pd-y-5 ">
        <wbs-icon [icon]="dataItem.icon" />
        <span class="mg-l-10"> {{ dataItem.text | translate }} </span>
      </div>
    </ng-template>
  </kendo-dropdownbutton>`,
  imports: [DropDownButtonModule, IconComponent, TranslateModule],
})
export class ActionIconListComponent {
  @Input() align?: 'left' | 'right' | 'center';
  @Input({ required: true }) size!: ButtonSize;
  @Input({ required: true }) fillMode!: ButtonFillMode;
  @Input({ required: true }) mainIcon!: SVGIcon;
  @Input({ required: true }) menuItems!: {
    icon: SVGIcon | IconDefinition;
    text: string;
    action: string;
  }[];
  @Output() readonly itemClicked = new EventEmitter<string>();
}
