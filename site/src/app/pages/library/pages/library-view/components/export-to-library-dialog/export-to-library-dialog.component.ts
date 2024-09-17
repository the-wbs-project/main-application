import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { FadingMessageComponent } from '@wbs/components/_utils/fading-message.component';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { VisibilitySelectionComponent } from '@wbs/components/_utils/visiblity-selection';
import { DataServiceFactory } from '@wbs/core/data-services';
import { SignalStore } from '@wbs/core/services';
import { EntryStore, MembershipStore, UserStore } from '@wbs/core/store';
import { TaskViewModel } from '@wbs/core/view-models';
import { EntryActivityService } from '@wbs/pages/library/services';
import { delay, tap } from 'rxjs/operators';
import { environment } from 'src/env';

@Component({
  standalone: true,
  templateUrl: './export-to-library-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    FadingMessageComponent,
    FormsModule,
    LabelModule,
    RouterModule,
    SaveButtonComponent,
    TextBoxModule,
    TranslateModule,
    VisibilitySelectionComponent,
  ],
})
export class ExportToLibraryDialogComponent extends DialogContentBase {
  private readonly activities = inject(EntryActivityService);
  private readonly data = inject(DataServiceFactory);
  private readonly entryStore = inject(EntryStore);
  private readonly membership = inject(MembershipStore);
  private readonly store = inject(SignalStore);
  private readonly userId = inject(UserStore).userId;
  private task: TaskViewModel | undefined;

  readonly checkIcon = faCheck;
  readonly newEntryId = signal<string | undefined>(undefined);
  readonly templateTitle = signal<string>('');
  readonly alias = signal<string>(environment.initialVersionAlias);
  readonly visibility = signal<'public' | 'private'>('public');
  readonly saveState = signal<'saving' | 'saved' | 'error' | undefined>(
    undefined
  );

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launch(dialog: DialogService, taskId: string): void {
    const dialogRef = dialog.open({ content: ExportToLibraryDialogComponent });
    const comp: ExportToLibraryDialogComponent = dialogRef.content.instance;

    comp.setup(taskId);
  }

  setup(taskId: string): void {
    this.task = this.entryStore.viewModels()?.find((x) => x.id === taskId);
    this.templateTitle.set(this.task?.title ?? '');
  }

  save(): void {
    if (!this.task) {
      return;
    }

    this.saveState.set('saving');

    const version = this.entryStore.version()!;

    this.data.libraryEntries
      .exportTasksAsync(
        version.ownerId,
        version.entryId,
        version.version,
        this.task.id,
        this.membership.membership()!.name,
        {
          alias: this.alias(),
          author: this.userId()!,
          includeResources: true,
          title: this.templateTitle(),
          visibility: this.visibility(),
        }
      )
      .pipe(
        delay(1000),
        tap((newEntryId) => {
          this.newEntryId.set(newEntryId);
          this.saveState.set('saved');
        }),
        tap((newEntryId) =>
          this.activities.entryCreated(
            version.ownerId,
            newEntryId,
            'task',
            this.templateTitle()
          )
        ),
        delay(5000)
      )
      .subscribe(() => this.saveState.set(undefined));
  }

  nav(): void {
    this.store
      .dispatch(
        new Navigate([
          '/',
          this.membership.membership()!.name,
          'library',
          'view',
          this.entryStore.version()?.ownerId,
          this.newEntryId(),
          1,
        ])
      )
      .subscribe(() => this.dialog.close());
  }
}
