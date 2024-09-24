import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { LibraryEntryVersionBasic } from '@wbs/core/models';
import { SaveService, sorter } from '@wbs/core/services';
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
    FormsModule,
    LabelModule,
    LibraryStatusPipe,
    SaveButtonComponent,
    TextBoxModule,
    TranslateModule,
    VersionPipe,
  ],
})
export class NewVersionDialogComponent extends DialogContentBase {
  private saveMethod!: (version: number, alias: string) => Observable<void>;

  readonly versions = signal<LibraryEntryVersionBasic[]>([]);
  readonly selected = model<number>();
  readonly alias = model('');
  readonly saveState = new SaveService();
  readonly sortedList = computed(() => {
    let list = this.versions();
    const current = list.find((x) => x.status === 'published');

    if (current) {
      list = [current, ...list.filter((x) => x.version !== current.version)];
    }

    return list.sort((a, b) => sorter(a.version, b.version, 'desc'));
  });

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launch(
    dialog: DialogService,
    versions: LibraryEntryVersionBasic[],
    version: LibraryVersionViewModel,
    save: (version: number, alias: string) => Observable<void>
  ): void {
    const ref = dialog.open({
      content: NewVersionDialogComponent,
    });
    const component = ref.content.instance as NewVersionDialogComponent;

    component.versions.set(versions);
    component.selected.set(
      versions.find((x) => x.status === 'published')?.version ?? version.version
    );
    component.saveMethod = save;
  }

  create(): void {
    const version = this.selected();
    const alias = this.alias();
    if (!version) return;

    this.saveState
      .quickCall(this.saveMethod(version, alias))
      .subscribe(() => this.dialog.close());
  }
}
