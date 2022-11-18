import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faUpload } from '@fortawesome/pro-light-svg-icons';
import {
  faChartGantt,
  faFileUpload,
  faTable,
} from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { BehaviorSubject } from 'rxjs';
import { FileUploaded } from '../../actions';

@Component({
  templateUrl: './start-view.component.html',
  styleUrls: ['./start-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartViewComponent {
  readonly over$ = new BehaviorSubject<boolean>(false);
  readonly faChartGantt = faChartGantt;
  readonly faFileUpload = faFileUpload;
  readonly faTable = faTable;
  readonly faUpload = faUpload;

  constructor(
    route: ActivatedRoute,
    private readonly data: DataServiceFactory,
    private readonly store: Store
  ) {
    route.data.subscribe((x) => console.log(x));
  }

  dropHandler(ev: DragEvent) {
    ev.preventDefault();

    if (ev.dataTransfer?.items) {
      //@ts-ignore
      for (const item of ev.dataTransfer.items) {
        if (item.kind === 'file') {
          this.processFile(item.getAsFile());
          break;
        }
      }
    } else {
      //@ts-ignore
      for (const file of ev.dataTransfer.files) {
        this.processFile(file);
        break;
      }
    }
  }

  dragOverHandler(ev: DragEvent) {
    ev.preventDefault();
    this.over$.next(true);
  }

  dragLeaveHandler(ev: DragEvent) {
    ev.preventDefault();
    this.over$.next(false);
  }

  handleUpload(input: HTMLInputElement) {
    if (input.files)
      //@ts-ignore
      for (const file of input.files) {
        this.processFile(file);
        break;
      }
  }

  downloadTemplate() {
    this.data.staticFiles
      .downloadAsync('Excel Template.xlsx', 'Excel Template.xlsx')
      .subscribe();
  }

  private processFile(file: File) {
    console.log('process');
    this.store.dispatch(new FileUploaded(file));
  }
}
