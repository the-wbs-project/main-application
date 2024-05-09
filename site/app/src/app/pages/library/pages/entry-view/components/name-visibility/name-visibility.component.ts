import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
} from '@progress/kendo-angular-dialog';
import { EntryService, EntryTaskService } from '@wbs/core/services';
import { VisibilitySelectionComponent } from '@wbs/dummy_components/visiblity-selection';
import { Observable } from 'rxjs';

declare type SaveCall = (name: string, visibility: string) => Observable<void>;

@Component({
  standalone: true,
  templateUrl: './name-visibility.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogModule,
    FormsModule,
    TranslateModule,
    VisibilitySelectionComponent,
  ],
})
export class NameVisibilityComponent extends DialogContentBase {
  private readonly entryService = inject(EntryService);
  private readonly taskService = inject(EntryTaskService);
  private saveCall?: SaveCall;

  readonly owner = signal<string | undefined>(undefined);
  readonly templateTitle = model<string>('');
  readonly visibility = model<'public' | 'private'>('public');
  readonly saveState = signal<'saving' | 'saved' | 'error' | undefined>(
    undefined
  );

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  setup(startingTitle: string, saveCall: SaveCall): void {
    this.templateTitle.set(startingTitle);
    this.saveCall = saveCall;
  }
}
