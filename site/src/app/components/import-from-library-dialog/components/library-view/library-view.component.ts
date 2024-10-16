import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { LibraryListFiltersComponent } from '@wbs/components/library/list-filters';
import { LibraryListComponent } from '@wbs/components/library/list';
import { LibraryViewModel } from '@wbs/core/view-models';
import { DataServiceFactory } from '@wbs/core/data-services';
import { MembershipStore } from '@wbs/core/store';
import { LoaderModule } from '@progress/kendo-angular-indicators';

@Component({
  standalone: true,
  selector: 'wbs-library-view',
  templateUrl: './library-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    LibraryListComponent,
    LibraryListFiltersComponent,
    LoaderModule,
    TranslateModule,
  ],
})
export class LibraryViewComponent implements OnInit {
  private readonly data = inject(DataServiceFactory);
  private readonly org = inject(MembershipStore).membership;
  //
  //  Inputs
  //
  readonly selected = model.required<LibraryViewModel | undefined>();
  //
  //  Signals
  //
  readonly loading = signal(false);
  readonly searchText = signal('');
  readonly roleFilters = signal<string[]>([]);
  readonly typeFilters = signal<string[]>([]);
  readonly library = signal<string>('internal');
  readonly entries = signal<LibraryViewModel[]>([]);
  //
  //  Outputs
  //
  readonly forceNext = output<void>();

  ngOnInit(): void {
    this.retrieve();
  }

  protected retrieve(): void {
    this.loading.set(true);
    this.entries.set([]);
    const lib = this.library();
    const obs =
      lib === 'public'
        ? this.data.library.getPublicAsync({
            searchText: this.searchText(),
            roles: this.roleFilters(),
            types: this.typeFilters(),
          })
        : this.data.library.getInternalAsync(this.org()!.id, {
            searchText: this.searchText(),
            roles: this.roleFilters(),
            types: this.typeFilters(),
          });

    obs.subscribe((entries) => {
      this.loading.set(false);
      this.entries.set(entries);
    });
  }
}
