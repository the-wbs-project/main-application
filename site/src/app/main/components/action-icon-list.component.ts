import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonFillMode,
  ButtonSize,
  DropDownButtonModule,
} from '@progress/kendo-angular-buttons';
import { ActionMenuItem } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-action-icon-list',
  template: `<kendo-dropdownbutton
    [fillMode]="fillMode"
    [size]="size"
    buttonClass="tx-8 pd-0-f"
    [data]="menuItems"
    [popupSettings]="{ align: align }"
    (itemClick)="clicked($event)"
  >
    <fa-icon [icon]="mainIcon" size="xl" />
    <ng-template kendoDropDownButtonItemTemplate let-dataItem>
      <div class="lh-10" [ngClass]="dataItem.cssClasses">
        <ng-template [ngIf]="dataItem.icon" [ngIfElse]="noIcon">
          <fa-icon [icon]="dataItem.icon" />
          <span class="mg-l-10"> {{ dataItem.text | translate }} </span>
        </ng-template>
        <ng-template #noIcon>
          {{ dataItem.text | translate }}
        </ng-template>
      </div>
    </ng-template>
  </kendo-dropdownbutton>`,
  imports: [
    DropDownButtonModule,
    FontAwesomeModule,
    NgClass,
    NgIf,
    TranslateModule,
  ],
})
export class ActionIconListComponent {
  @Input() align?: 'left' | 'right' | 'center';
  @Input({ required: true }) size!: ButtonSize;
  @Input({ required: true }) fillMode!: ButtonFillMode;
  @Input({ required: true }) mainIcon!: IconDefinition;
  @Input({ required: true }) menuItems!: ActionMenuItem[];
  @Output() readonly itemClicked = new EventEmitter<string>();

  clicked(item: ActionMenuItem): void {
    if (item.disabled) return;

    this.itemClicked.emit(item.action);
  }
}
