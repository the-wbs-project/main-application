import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUpload } from '@fortawesome/pro-light-svg-icons';
import {
  faChartGantt,
  faFile,
  faTable,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { FileSelectModule, SelectEvent } from '@progress/kendo-angular-upload';
import { DataServiceFactory } from '@wbs/core/data-services';
import { FileUploaded } from '../../actions';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: './start-view.component.html',
  styleUrls: ['./start-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FileSelectModule, FontAwesomeModule, NgClass, TranslateModule],
})
export class StartViewComponent {
  readonly faChartGantt = faChartGantt;
  readonly faFile = faFile;
  readonly faTable = faTable;
  readonly faUpload = faUpload;

  constructor(
    private readonly data: DataServiceFactory,
    private readonly store: Store
  ) {}

  onSelect(ev: SelectEvent): void {
    this.store.dispatch(new FileUploaded(ev.files[0]));
  }

  downloadTemplate() {
    this.data.staticFiles
      .downloadAsync('excel-upload-template.xlsx', 'Excel Template.xlsx')
      .subscribe();
  }
}
