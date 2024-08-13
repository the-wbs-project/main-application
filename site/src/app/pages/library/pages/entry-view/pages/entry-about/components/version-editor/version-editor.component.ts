import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faSave, faXmark } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { SaveService } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { EntryStore } from '@wbs/core/store';
import { LibraryVersionViewModel } from '@wbs/core/view-models';
import { VersionPipe } from '@wbs/pipes/version.pipe';

@Component({
  standalone: true,
  selector: 'wbs-version-editor',
  templateUrl: './version-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'child-hoverer' },
  imports: [
    ButtonModule,
    FontAwesomeModule,
    FormsModule,
    SaveMessageComponent,
    TranslateModule,
    TextBoxModule,
    VersionPipe,
  ],
})
export class VersionEditorComponent {
  private readonly service = inject(EntryService);

  readonly editIcon = faPencil;
  readonly saveIcon = faSave;
  readonly cancelIcon = faXmark;
  readonly store = inject(EntryStore);
  readonly record = input.required<LibraryVersionViewModel>();
  readonly editTitle = model<string>();
  readonly editMode = signal(false);
  readonly saveMode = new SaveService();

  edit(): void {
    this.editTitle.set(this.record().versionAlias ?? '');
    this.editMode.set(true);
  }

  keydown({ key }: { key: string }): void {
    if (key === 'Enter') this.save();
    else if (key === 'Escape') this.cancel();
  }

  save(): void {
    const alias = this.editTitle();

    this.editMode.set(false);
    this.saveMode
      .call(this.service.versionAliasChangedAsync(alias ?? ''))
      .subscribe();
  }

  cancel(): void {
    this.editTitle.set('');
    this.editMode.set(false);
  }
}
