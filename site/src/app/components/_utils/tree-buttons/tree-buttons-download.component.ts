import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCloudDownload } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-tree-buttons-download',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, FontAwesomeModule, TranslateModule],
  template: `<button kendoButton size="small">
    <fa-icon [icon]="icon" class="mg-r-5" />
    {{ 'General.Download' | translate }}
  </button>`,
})
export class TreeButtonsDownloadComponent {
  readonly icon = faCloudDownload;
}
