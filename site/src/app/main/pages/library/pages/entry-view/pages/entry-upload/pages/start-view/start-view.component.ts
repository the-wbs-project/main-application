import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChartGantt,
  faFile,
  faTable,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { FileInfo } from '@progress/kendo-angular-upload';
import { DataServiceFactory } from '@wbs/core/data-services';
import { AlertComponent } from '@wbs/main/components/alert.component';
import { UploaderComponent } from '@wbs/main/components/uploader/uploader.component';
import { FileUploaded } from '../../actions';

@Component({
  standalone: true,
  templateUrl: './start-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    FontAwesomeModule,
    TranslateModule,
    UploaderComponent,
  ],
})
export class StartViewComponent {
  private readonly data = inject(DataServiceFactory);
  private readonly store = inject(Store);

  readonly faChartGantt = faChartGantt;
  readonly faFile = faFile;
  readonly faTable = faTable;

  onSelect(file: FileInfo): void {
    this.store.dispatch(new FileUploaded(file));
  }

  downloadTemplate() {
    this.data.staticFiles
      .downloadAsync('excel-upload-template.xlsx', 'Excel Template.xlsx')
      .subscribe();
  }
}
