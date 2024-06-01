import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileExcel } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { FileInfo } from '@progress/kendo-angular-upload';
import { DataServiceFactory } from '@wbs/core/data-services';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { UploaderComponent } from '@wbs/components/uploader/uploader.component';

@Component({
  standalone: true,
  selector: 'wbs-upload-start-view',
  templateUrl: './start-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    ButtonModule,
    FontAwesomeModule,
    TranslateModule,
    UploaderComponent,
  ],
})
export class UploadStartViewComponent {
  private readonly data = inject(DataServiceFactory);

  readonly excelIcon = faFileExcel;
  readonly fileUploaded = output<FileInfo>();

  downloadTemplate() {
    this.data.staticFiles
      .downloadAsync('phase-extract.xlsx', 'Excel Template.xlsx')
      .subscribe();
  }
}
