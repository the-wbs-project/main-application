import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { SaveService } from '@wbs/core/services';
import { LibraryVersionViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

declare type SaveFunction = (
  notes: string
) => Observable<LibraryVersionViewModel>;

@Component({
  standalone: true,
  templateUrl: './publish-version-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogModule,
    FormsModule,
    LabelModule,
    SaveButtonComponent,
    TextBoxModule,
    TranslateModule,
  ],
})
export class PublishVersionDialogComponent extends DialogContentBase {
  private saveFunction!: SaveFunction;

  readonly releaseNotes = signal<string>('');
  readonly saveService = new SaveService();

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launchAsync(
    dialog: DialogService,
    saveFunction: SaveFunction
  ): Observable<LibraryVersionViewModel | null> {
    const dialogRef = dialog.open({ content: PublishVersionDialogComponent });
    const comp: PublishVersionDialogComponent = dialogRef.content.instance;

    comp.saveFunction = saveFunction;

    return dialogRef.result.pipe(
      map((r: unknown) =>
        r instanceof DialogCloseResult ? null : (r as LibraryVersionViewModel)
      )
    );
  }

  save(): void {
    this.saveService
      .quickCall(this.saveFunction(this.releaseNotes()))
      .subscribe((x) => this.dialog.close(x));
  }
}
