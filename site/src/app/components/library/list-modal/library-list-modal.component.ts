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
import {
  LibraryEntryNode,
  LibraryEntryVersion,
  LibraryImportResults,
  StepperItem,
} from '@wbs/core/models';
import { LibraryEntryViewModel } from '@wbs/core/view-models';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryListComponent } from '../list';
import { LibraryListFiltersComponent } from '../list-filters';
import { LibraryImportTreeComponent } from './components';
import { MembershipStore } from '@wbs/core/store';

@Component({
  standalone: true,
  templateUrl: './library-list-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    FontAwesomeModule,
    LibraryListFiltersComponent,
    LibraryImportTreeComponent,
    LibraryListComponent,
    LoaderModule,
    SaveMessageComponent,
    TranslateModule,
    AlertComponent,
  ],
})
export class LibraryListModalComponent extends DialogContentBase {
  private readonly data = inject(DataServiceFactory);
  private readonly membership = inject(MembershipStore).membership;

  readonly org = signal<string | undefined>(undefined);
  readonly selected = model<LibraryEntryViewModel | undefined>(undefined);
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
  readonly typeFilters = model<string[]>([]);
  readonly library = model<string>('personal');
  //
  //  View 2 Items
  //
  readonly loadingTree = signal(false);
  readonly version = signal<LibraryEntryVersion | undefined>(undefined);
  readonly tasks = signal<LibraryEntryNode[]>([]);

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  loadTree(): void {
    const vm = this.selected()!;

    this.view.set(1);
    this.loadingTree.set(true);

    const visibility =
      this.membership()!.name === vm.ownerId ? 'private' : 'public';

    forkJoin({
      version: this.data.libraryEntryVersions.getAsync(
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
    library: string,
    typeFilters: string[] | undefined
  ): Observable<LibraryImportResults | undefined> {
    const ref = dialog.open({
      content: LibraryListModalComponent,
    });
    const component = ref.content.instance as LibraryListModalComponent;

    component.org.set(org);
    component.library.set(library);
    component.typeFilters.set(typeFilters ?? []);
    component.ready.set(true);

    return ref.result.pipe(
      map((x: unknown) =>
        x instanceof DialogCloseResult ? undefined : <LibraryImportResults>x
      )
    );
  }
}
