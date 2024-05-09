import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import { EntryTypeIconPipe } from '@wbs/pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '@wbs/pipes/entry-type-title.pipe';

@Component({
  standalone: true,
  selector: 'wbs-library-item-type-selector',
  templateUrl: './library-item-type-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonGroupModule,
    ButtonModule,
    EntryTypeIconPipe,
    EntryTypeTitlePipe,
    FontAwesomeModule,
    TranslateModule,
  ],
})
export class LibraryItemTypeSelectorComponent {
  readonly typeDefinitions = ['project', 'phase', 'task'];
  readonly types = model.required<string[]>();

  toggle(type: string) {
    this.types.update((types) =>
      types.includes(type) ? types.filter((t) => t !== type) : [...types, type]
    );
  }
}
