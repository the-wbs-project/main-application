import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCloudUpload } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-tree-buttons-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, FontAwesomeModule, TranslateModule],
  template: `<button kendoButton size="small">
    <fa-icon [icon]="icon" class="mg-r-5" />
    {{ 'Wbs.UploadTasks' | translate }}
  </button>`,
})
export class TreeButtonsUploadComponent {
  readonly icon = faCloudUpload;
}
