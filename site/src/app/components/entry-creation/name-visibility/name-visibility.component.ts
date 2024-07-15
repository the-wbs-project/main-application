import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
} from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { FadingMessageComponent } from '@wbs/components/_utils/fading-message.component';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { VisibilitySelectionComponent } from '@wbs/components/_utils/visiblity-selection';
import { DataServiceFactory } from '@wbs/core/data-services';
import { SignalStore } from '@wbs/core/services';
import { EntryActivityService, EntryService } from '@wbs/core/services/library';
import { TaskViewModel } from '@wbs/core/view-models';
import { EntryStore, MembershipStore, UserStore } from '@wbs/core/store';
import { delay, tap } from 'rxjs/operators';

@Component({
  standalone: true,
  templateUrl: './name-visibility.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogModule,
    FadingMessageComponent,
    FormsModule,
    RouterModule,
    SaveButtonComponent,
    TextBoxModule,
    TranslateModule,
    VisibilitySelectionComponent,
  ],
  providers: [EntryActivityService, EntryService],
})
export class NameVisibilityComponent extends DialogContentBase {
  private readonly activities = inject(EntryActivityService);
  private readonly data = inject(DataServiceFactory);
  private readonly entryStore = inject(EntryStore);
  private readonly membership = inject(MembershipStore);
  private readonly store = inject(SignalStore);
  private readonly userId = inject(UserStore).userId;
  private task: TaskViewModel | undefined;

  readonly checkIcon = faCheck;
  readonly newEntryId = signal<string | undefined>(undefined);
  readonly templateTitle = model<string>('');
  readonly visibility = model<'public' | 'private'>('public');
  readonly saveState = signal<'saving' | 'saved' | 'error' | undefined>(
    undefined
  );

  constructor(dialog: DialogRef) {
    super(dialog);
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

    const entry = this.entryStore.entry()!;
    const version = this.entryStore.version()!;

    this.data.libraryEntryNodes
      .exportAsync(entry.owner, entry.id, version.version, this.task.id, {
        author: this.userId()!,
        includeResources: true,
        title: this.templateTitle(),
        visibility: this.visibility(),
      })
      .pipe(
        delay(1000),
        tap((newEntryId) => {
          this.newEntryId.set(newEntryId);
          this.saveState.set('saved');
        }),
        tap((newEntryId) =>
          this.activities.entryCreated(newEntryId, 'task', this.templateTitle())
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
          this.entryStore.entry()?.owner,
          this.newEntryId(),
          1,
        ])
      )
      .subscribe(() => this.dialog.close());
  }
}
