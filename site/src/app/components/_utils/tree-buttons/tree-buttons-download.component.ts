import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCloudDownload } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DropDownButtonModule,
} from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-tree-buttons-download',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DropDownButtonModule,
    FontAwesomeModule,
    TranslateModule,
  ],
  template: `@if (dropdownItems(); as items) {
    <kendo-dropdownbutton
      [data]="items"
      size="small"
      valueField="id"
      textField="text"
      (itemClick)="itemClick.emit($event.id)"
    >
      <fa-icon [icon]="icon" class="mg-r-5" />
      {{ 'Wbs.DownloadTasks' | translate }}
      <ng-template kendoDropDownButtonItemTemplate let-dataItem>
        {{ dataItem.text | translate }}
      </ng-template>
    </kendo-dropdownbutton>
    } @else {<button kendoButton size="small">
      <fa-icon [icon]="icon" class="mg-r-5" />
      {{ 'Wbs.DownloadTasks' | translate }}
    </button>
    }`,
})
export class TreeButtonsDownloadComponent {
  readonly icon = faCloudDownload;
  readonly dropdownItems = input<{ id: string; text: string }[]>();
  readonly itemClick = output<string>();
}
