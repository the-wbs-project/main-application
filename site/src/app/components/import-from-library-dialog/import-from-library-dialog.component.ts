import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faDiagramSubtask,
  faSearch,
  faTasks,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { StepperModule } from '@progress/kendo-angular-layout';
import { ScrollToTopDirective } from '@wbs/core/directives/scrollToTop.directive';
import { StepperItem } from '@wbs/core/models';
import {
  CategoryViewModel,
  LibraryTaskViewModel,
  LibraryVersionViewModel,
  LibraryViewModel,
} from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SaveButtonComponent } from '../_utils/save-button.component';
import {
  LibraryViewComponent,
  OptionsViewComponent,
  TaskViewComponent,
} from './components';
import { LibraryImportResults } from './models';

@Component({
  standalone: true,
  templateUrl: './import-from-library-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    FontAwesomeModule,
    LibraryViewComponent,
    OptionsViewComponent,
    SaveButtonComponent,
    ScrollToTopDirective,
    StepperModule,
    TaskViewComponent,
    TranslateModule,
  ],
})
export class ImportFromLibraryDialogComponent extends DialogContentBase {
  private saveFunc!: (options: LibraryImportResults) => Observable<boolean>;

  readonly view = signal(0);
  readonly saving = signal(false);
  readonly steps: StepperItem[] = [
    { label: 'General.Search', icon: faSearch },
    { label: 'Upload.ImportOptions', icon: faTasks },
    { label: 'Upload.ReviewTasks', icon: faDiagramSubtask },
  ];
  readonly isNextDisabled = computed(() => {
    const page = this.view();
    const libraryType = this.selected()?.type;

    if (page !== 1) return false;

    if (libraryType === 'project' && this.projectAsTask() === undefined)
      return true;

    if (libraryType !== 'project' && this.onlyImportSubtasks() === undefined)
      return true;

    return false;
  });
  //
  //  View 1 Items
  //
  readonly selected = model<LibraryViewModel | undefined>(undefined);
  //
  //  View 2 Items
  //
  readonly projectAsTask = model<boolean | undefined>(undefined);
  readonly onlyImportSubtasks = model<boolean | undefined>(undefined);
  //
  //  View 3 Items
  //
  readonly version = signal<LibraryVersionViewModel | undefined>(undefined);
  readonly versionDisciplines = signal<CategoryViewModel[]>([]);
  readonly tasks = signal<LibraryTaskViewModel[]>([]);

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  back(): void {
    this.view.set(this.view() - 1);
  }

  next(): void {
    this.view.set(this.view() + 1);
  }

  protected librarySelected(library: LibraryViewModel): void {
    if (!library) return;

    this.selected.set(library);
    //this.next();
  }

  startSaving(): void {
    const options: LibraryImportResults = {
      tasks: this.tasks(),
      version: this.version()!,
      versionDisciplines: this.versionDisciplines(),
      importProjectAsTask: this.projectAsTask(),
      onlyImportSubtasks: this.onlyImportSubtasks(),
    };

    this.saving.set(true);
    this.saveFunc(options).subscribe((success) => {
      this.saving.set(false);
      if (success) this.dialog.close();
    });
  }

  static launchAsync(
    dialog: DialogService,
    saveFunc: (options: LibraryImportResults) => Observable<boolean>
  ): Observable<boolean> {
    const ref = dialog.open({
      content: ImportFromLibraryDialogComponent,
    });
    const component = ref.content.instance as ImportFromLibraryDialogComponent;

    component.saveFunc = saveFunc;

    return ref.result.pipe(map((x) => (typeof x === 'boolean' ? x : false)));
  }
}
