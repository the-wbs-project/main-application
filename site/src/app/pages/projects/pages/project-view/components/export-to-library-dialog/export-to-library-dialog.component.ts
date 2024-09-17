import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import {
  CheckBoxModule,
  SwitchModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { InfoMessageComponent } from '@wbs/components/_utils/info-message.component';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { VisibilitySelectionComponent } from '@wbs/components/_utils/visiblity-selection';
import {
  LIBRARY_ENTRY_TYPES,
  LIBRARY_ENTRY_TYPES_TYPE,
} from '@wbs/core/models';
import { SaveService } from '@wbs/core/services';
import { ExportResults } from './export-results.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/env';
import { ExportToLibraryDataModel } from './export-to-library-data.model';
import { ExportToLibraryDialogService } from './export-to-library-dialog.service';

@Component({
  standalone: true,
  templateUrl: './export-to-library-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ExportToLibraryDialogService],
  imports: [
    ButtonModule,
    CheckBoxModule,
    DialogModule,
    FormsModule,
    InfoMessageComponent,
    LabelModule,
    SaveButtonComponent,
    SwitchModule,
    TextBoxModule,
    TranslateModule,
    VisibilitySelectionComponent,
  ],
})
export class ExportToLibraryDialogComponent extends DialogContentBase {
  private readonly service = inject(ExportToLibraryDialogService);
  private owner!: string;
  private projectId!: string;
  private taskId?: string;
  private type!: LIBRARY_ENTRY_TYPES_TYPE;

  readonly saveState = new SaveService();

  readonly title = signal('');
  readonly alias = signal(environment.initialVersionAlias);
  readonly includeResources = signal(true);
  readonly visibility = signal('public');
  readonly titleHint = computed(() => {
    if (this.type === LIBRARY_ENTRY_TYPES.PHASE)
      return 'LibraryExport.TitleHintPhase';

    if (this.type === LIBRARY_ENTRY_TYPES.PROJECT)
      return 'LibraryExport.TitleHintProject';

    if (this.type === LIBRARY_ENTRY_TYPES.TASK)
      return 'LibraryExport.TitleHintTask';

    return '';
  });
  readonly isValid = computed(() => this.title().length > 0);

  constructor(x: DialogRef) {
    super(x);
  }

  static launchAsync(
    dialog: DialogService,
    data: ExportToLibraryDataModel
  ): Observable<string | undefined> {
    const ref = dialog.open({
      content: ExportToLibraryDialogComponent,
    });
    const comp = ref.content.instance as ExportToLibraryDialogComponent;
    comp.type = data.type;
    comp.owner = data.owner;
    comp.projectId = data.projectId;
    comp.taskId = data.taskId;

    comp.title.set(data.title);

    return ref.result.pipe(map((x) => (typeof x === 'string' ? x : undefined)));
  }

  save(): void {
    const model: ExportResults = {
      alias: this.alias(),
      title: this.title(),
      includeResources: this.includeResources(),
      visibility: this.visibility(),
    };
    const obs = this.service.export(
      this.type,
      this.owner,
      this.projectId,
      this.taskId,
      model
    );
    this.saveState.quickCall(obs).subscribe((recordId) => {
      if (recordId) this.dialog.close(recordId);
    });
  }
}
