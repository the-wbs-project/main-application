import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChartGantt,
  faFile,
  faTable,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { FileInfo } from '@progress/kendo-angular-upload';
import { DataServiceFactory } from '@wbs/core/data-services';
import { AlertComponent } from '@wbs/main/components/alert.component';
import { UploaderComponent } from '@wbs/main/components/uploader/uploader.component';

@Component({
  standalone: true,
  selector: 'wbs-upload-start-view',
  templateUrl: './start-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    FontAwesomeModule,
    TranslateModule,
    UploaderComponent,
  ],
})
export class UploadStartViewComponent {
  private readonly data = inject(DataServiceFactory);

  readonly faChartGantt = faChartGantt;
  readonly faFile = faFile;
  readonly faTable = faTable;
  readonly fileUploaded = output<FileInfo>();

  downloadTemplate() {
    this.data.staticFiles
      .downloadAsync('excel-upload-template.xlsx', 'Excel Template.xlsx')
      .subscribe();
  }
}
