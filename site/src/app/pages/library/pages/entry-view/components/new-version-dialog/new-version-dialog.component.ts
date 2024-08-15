import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntryVersionBasic } from '@wbs/core/models';
import { SaveService, sorter } from '@wbs/core/services';
import { UserStore } from '@wbs/core/store';
import { LibraryVersionViewModel } from '@wbs/core/view-models';
import { LibraryStatusPipe } from '@wbs/pipes/library-status.pipe';
import { VersionPipe } from '@wbs/pipes/version.pipe';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  standalone: true,
  templateUrl: './new-version-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    ButtonModule,
    DialogModule,
    DropDownListModule,
    FontAwesomeModule,
    FormsModule,
    LabelModule,
    LibraryStatusPipe,
    TextBoxModule,
    TranslateModule,
    VersionPipe,
  ],
})
export class NewVersionDialogComponent extends DialogContentBase {
  private readonly data = inject(DataServiceFactory);
  private readonly userId = inject(UserStore).userId;
  private ownerId?: string;
  private entryId?: string;

  readonly versions = signal<LibraryEntryVersionBasic[]>([]);
  readonly selected = model<number>();
  readonly alias = model('');
  readonly saveState = new SaveService();
  readonly sortedList = computed(() => {
    const list = this.versions();
    const current = list.find((x) => x.status === 'published');

    return [
      current,
      ...list
        .filter((x) => x.version !== current!.version)
        .sort((a, b) => sorter(a.version, b.version, 'desc')),
    ];
  });

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launchAsync(
    dialog: DialogService,
    versions: LibraryEntryVersionBasic[],
    version: LibraryVersionViewModel
  ): Observable<{ version: number; alias: string } | undefined> {
    const ref = dialog.open({
      content: NewVersionDialogComponent,
    });
    const component = ref.content.instance as NewVersionDialogComponent;

    component.ownerId = version.ownerId;
    component.entryId = version.entryId;
    component.versions.set(versions);
    component.selected.set(
      versions.find((x) => x.status === 'published')?.version ?? version.version
    );

    return ref.result.pipe(
      map((x: unknown) => (x instanceof DialogCloseResult ? undefined : <any>x))
    );
  }

  create(): void {
    this.dialog.close({ version: this.selected(), alias: this.alias() });
  }
}
