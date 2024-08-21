import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { faSearch, faStamp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntryNode, StepperItem } from '@wbs/core/models';
import {
  LibraryImportResults,
  LibraryVersionViewModel,
  LibraryViewModel,
} from '@wbs/core/view-models';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryListComponent } from '../list';
import { LibraryListFiltersComponent } from '../list-filters';
import { LibraryImportTreeComponent } from './components';
import { HeightDirective } from '@wbs/core/directives/height.directive';

@Component({
  standalone: true,
  templateUrl: './library-list-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    ButtonModule,
    DialogModule,
    FontAwesomeModule,
    LibraryListFiltersComponent,
    LibraryImportTreeComponent,
    LibraryListComponent,
    LoaderModule,
    SaveMessageComponent,
    TranslateModule,
    HeightDirective,
  ],
})
export class LibraryListModalComponent extends DialogContentBase {
  private readonly data = inject(DataServiceFactory);
  private org?: string;
  private userId?: string;

  readonly containerHeight = signal(100);
  readonly selected = model<LibraryViewModel | undefined>(undefined);
  readonly view = signal(0);
  readonly ready = signal(false);
  readonly steps: StepperItem[] = [
    { label: 'General.Search', icon: faSearch },
    { label: 'General.Review', icon: faStamp },
  ];
  //
  //  View 1 Items
  //
  readonly searchText = model('');
  readonly roleFilters = signal<string[]>([]);
  readonly typeFilters = signal<string[]>([]);
  readonly library = model<string>('organizational');
  //
  //  View 2 Items
  //
  readonly loadingTree = signal(false);
  readonly version = signal<LibraryVersionViewModel | undefined>(undefined);
  readonly tasks = signal<LibraryEntryNode[]>([]);
  readonly entries = signal<LibraryViewModel[]>([]);

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  loadTree(): void {
    const vm = this.selected()!;

    this.view.set(1);
    this.loadingTree.set(true);

    const visibility = this.org === vm.ownerId ? 'private' : 'public';

    forkJoin({
      version: this.data.libraryEntryVersions.getByIdAsync(
        vm.ownerId,
        vm.entryId,
        vm.version
      ),
      tasks: this.data.libraryEntryNodes.getAllAsync(
        vm.ownerId,
        vm.entryId,
        vm.version,
        visibility
      ),
    }).subscribe(({ version, tasks }) => {
      this.version.set(version);
      this.tasks.set(tasks);
      this.loadingTree.set(false);
    });
  }

  save(): void {
    this.dialog.close(<LibraryImportResults>{
      tasks: this.tasks(),
      owner: this.selected()!.ownerId,
      version: this.version()!,
      importDisciplines: true,
    });
  }

  static launchAsync(
    dialog: DialogService,
    org: string,
    userId: string,
    library: string
  ): Observable<LibraryImportResults | undefined> {
    const ref = dialog.open({
      content: LibraryListModalComponent,
    });
    const component = ref.content.instance as LibraryListModalComponent;

    component.org = org;
    component.userId = userId;
    component.library.set(library);
    component.typeFilters.set([]);
    component.ready.set(true);
    component.retrieve();

    return ref.result.pipe(
      map((x: unknown) =>
        x instanceof DialogCloseResult ? undefined : <LibraryImportResults>x
      )
    );
  }

  protected retrieve(): void {
    /*this.data.libraryEntries
      .searchAsync(this.org!, {
        userId: this.userId!,
        library: this.library(),
        searchText: this.searchText(),
        roles: this.roleFilters(),
        types: this.typeFilters(),
      })
      .subscribe((entries) => this.entries.set(entries));*/
  }
}
