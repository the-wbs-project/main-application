import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCactus } from '@fortawesome/pro-thin-svg-icons';
import { faFilters } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { plusIcon } from '@progress/kendo-svg-icons';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntryViewModel } from '@wbs/core/view-models';
import { PageHeaderComponent } from '@wbs/main/components/page-header/page-header.component';
import { EntryCreationService } from './services';

@Component({
  standalone: true,
  templateUrl: './library-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    NgClass,
    PageHeaderComponent,
    RouterModule,
    TranslateModule,
  ],
  providers: [EntryCreationService],
})
export class LibraryListComponent implements OnInit {
  @Input() owner!: string;

  readonly faCactus = faCactus;
  readonly faFilters = faFilters;

  readonly entries = signal<LibraryEntryViewModel[]>([]);

  filterToggle = false;

  expanded = true;

  readonly plusIcon = plusIcon;

  constructor(
    readonly creation: EntryCreationService,
    private readonly cd: ChangeDetectorRef,
    private readonly data: DataServiceFactory,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.data.libraryEntries.getAllAsync(this.owner).subscribe((entries) => {
      this.entries.set(entries);
    });
  }

  force() {
    this.cd.detectChanges();
  }
}
