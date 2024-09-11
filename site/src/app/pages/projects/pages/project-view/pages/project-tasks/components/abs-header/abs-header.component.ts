import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleQuestion } from '@fortawesome/pro-duotone-svg-icons';
import {
  faCheck,
  faPencil,
  faSpinner,
  faXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { PopoverModule, Position } from '@progress/kendo-angular-tooltip';
import { SaveState } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-abs-header',
  templateUrl: './abs-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, FontAwesomeModule, PopoverModule, TranslateModule],
})
export class AbsHeaderComponent {
  readonly icon = faCircleQuestion;
  readonly editIcon = faPencil;
  readonly saveIcon = faCheck;
  readonly savingIcon = faSpinner;
  readonly cancelIcon = faXmark;
  //
  // Inputs
  //
  readonly inEditMode = input.required<boolean>();
  readonly saveState = input.required<SaveState>();
  readonly text = input.required<'abbrev' | 'full'>();
  readonly position = input<Position>('bottom');
  //
  // Computed
  //
  readonly title = computed(() =>
    this.text() === 'abbrev' ? 'Wbs.ABS' : 'Wbs.ABS-Full'
  );
  readonly saving = computed(() => this.saveState() === 'saving');
  //
  // Outputs
  //
  readonly edit = output<void>();
  readonly save = output<void>();
  readonly cancel = output<void>();
}
