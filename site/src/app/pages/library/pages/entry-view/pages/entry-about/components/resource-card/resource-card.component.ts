import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { RecordResourceListComponent } from '@wbs/components/record-resources/components/list';
import { ResourceRecord } from '@wbs/core/models';
import { LibraryResourcesService } from '@wbs/pages/library/services';
import { CardHeaderComponent } from '../card-header.component';

@Component({
  standalone: true,
  selector: 'wbs-resource-card',
  templateUrl: './resource-card.component.html',
  host: { class: 'card dashboard-card full-item' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    CardHeaderComponent,
    FontAwesomeModule,
    RecordResourceListComponent,
    TranslateModule,
  ],
  providers: [LibraryResourcesService],
})
export class ResourceCardComponent implements OnInit {
  readonly addIcon = faPlus;
  readonly service = inject(LibraryResourcesService);
  //
  //  Inputs & Signals
  //
  readonly apiUrlPrefix = input.required<string>();
  readonly list = signal<ResourceRecord[]>([]);

  ngOnInit(): void {
    this.service
      .getRecordsAsync(undefined)
      .subscribe((list) => this.list.set(list));
  }

  launchAdd(): void {
    this.service.launchAddAsync(undefined).subscribe((item) => {
      if (item) this.updateList([item]);
    });
  }

  editRecord(record: ResourceRecord): void {
    this.service.editRecordAsync(undefined, record).subscribe((item) => {
      if (item) this.updateList([item]);
    });
  }

  deleteRecord(record: ResourceRecord): void {
    this.service.deleteRecordAsync(undefined, record).subscribe((deleted) => {
      if (deleted)
        this.list.update((list) => list.filter((x) => x.id !== record.id));
    });
  }

  save(records: ResourceRecord[]): void {
    this.service
      .saveRecordsAsync(undefined, records)
      .subscribe((newRecords) => {
        this.updateList(newRecords);
      });
  }

  private updateList(records: ResourceRecord[]): void {
    this.list.update((list) => {
      for (const r of records) {
        const index = list.findIndex((x) => x.id === r.id);
        if (index > -1) {
          list[index] = r;
        } else {
          list.push(r);
        }
      }
      return [...list];
    });
  }
}
