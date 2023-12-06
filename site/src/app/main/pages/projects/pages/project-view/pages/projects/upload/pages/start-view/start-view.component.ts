import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
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
import { UploaderComponent } from '@wbs/main/components/uploader/uploader.component';
import { FileUploaded } from '../../actions';

@Component({
  standalone: true,
  templateUrl: './start-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FontAwesomeModule, NgClass, TranslateModule, UploaderComponent],
  styles: ['.k-dropzone-inner { background-color: #c8dadf; }'],
})
export class StartViewComponent {
  readonly faChartGantt = faChartGantt;
  readonly faFile = faFile;
  readonly faTable = faTable;

  constructor(
    private readonly data: DataServiceFactory,
    private readonly store: Store
  ) {}

  onSelect(file: FileInfo): void {
    this.store.dispatch(new FileUploaded(file));
  }

  downloadTemplate() {
    this.data.staticFiles
      .downloadAsync('excel-upload-template.xlsx', 'Excel Template.xlsx')
      .subscribe();
  }
}
