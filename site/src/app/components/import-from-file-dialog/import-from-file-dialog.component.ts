import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { FileInfo } from '@progress/kendo-angular-upload';
import { HeightDirective } from '@wbs/core/directives/height.directive';
import { WbsNode } from '@wbs/core/models';
import { CategoryService } from '@wbs/core/services';
import { CategoryViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogButtonsComponent } from '../dialog-buttons';
import { DialogWrapperComponent } from '../dialog-wrapper';
import {
  DisciplinesViewComponent,
  TaskViewComponent,
  UploadViewComponent,
} from './components';
import { UploadDialogService, UploadDialogViewService } from './services';

@Component({
  standalone: true,
  templateUrl: './import-from-file-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UploadDialogService, UploadDialogViewService],
  imports: [
    DialogButtonsComponent,
    DialogModule,
    DialogWrapperComponent,
    DisciplinesViewComponent,
    HeightDirective,
    TaskViewComponent,
    TranslateModule,
    UploadViewComponent,
  ],
})
export class ImportFromFileDialogComponent extends DialogContentBase {
  private readonly categoryService = inject(CategoryService);
  private saveFunc!: (tasks: WbsNode[]) => Observable<boolean>;
  private errors?: string[];

  readonly dataService = inject(UploadDialogService);
  readonly viewService = inject(UploadDialogViewService);

  //
  //  Signals
  //
  readonly saving = signal(false);
  readonly containerHeight = signal(100);
  readonly disciplines = signal<CategoryViewModel[]>([]);
  readonly disciplines2 = computed(() => {
    const disciplines = this.disciplines();

    return disciplines.length > 0
      ? disciplines
      : this.categoryService.buildViewModelsFromDefinitions();
  });

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launchAsync(
    dialogService: DialogService,
    disciplines: CategoryViewModel[],
    saveFunction: (tasks: WbsNode[]) => Observable<boolean>
  ): Observable<boolean> {
    const dialogRef = dialogService.open({
      content: ImportFromFileDialogComponent,
    });

    const comp = dialogRef.content.instance as ImportFromFileDialogComponent;

    comp.saveFunc = saveFunction;
    comp.disciplines.set(disciplines);

    return dialogRef.result.pipe(
      map((x) => (typeof x === 'boolean' ? x : false))
    );
  }

  fileUploaded(file: FileInfo): void {
    this.dataService.file.set(file);

    if (!this.dataService.isFileSupported()) {
      this.viewService.viewType.set('ticket');
      this.viewService.next();
      return;
    }

    this.dataService.uploadFile().subscribe((results) => {
      if (results?.errors) {
        this.errors = results.errors;
        this.viewService.viewType.set('ticket');
        this.viewService.next();
      } else {
        if (this.dataService.extension() === 'xlsx') {
          this.viewService.viewType.set('excel');
        } else {
          this.viewService.viewType.set('project');
        }
        this.viewService.next();
      }
    });
  }

  startSaving(): void {
    this.saving.set(true);
    this.saveFunc(this.dataService.converTasksToSave()).subscribe((result) => {
      this.saving.set(false);
      this.dialog.close(result);
    });
  }

  reloadTree(): void {
    this.dataService.reload();
  }

  next(): void {
    if (this.viewService.page().id === 'disciplines') {
      this.dataService.verifyTasks();
    }
    this.viewService.next();
  }
}
