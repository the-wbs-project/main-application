import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
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
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';

@Component({
  standalone: true,
  selector: 'wbs-upload-view',
  templateUrl: './upload-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    ButtonModule,
    FontAwesomeModule,
    TranslateModule,
    UploaderComponent,
  ],
})
export class UploadViewComponent {
  private readonly data = inject(DataServiceFactory);
  //
  //  Constants
  //
  readonly excelIcon = faFileExcel;
  readonly spinnerIcon = faSpinner;
  //
  //  Inputs
  //
  readonly isLoadingFile = input.required<boolean>();
  readonly fileType = input.required<string | undefined>();
  //
  //  Outputs
  //
  readonly uploaded = output<FileInfo>();

  downloadTemplate() {
    this.data.staticFiles
      .downloadAsync('phase-extract.xlsx', 'Excel Template.xlsx')
      .subscribe();
  }
}
