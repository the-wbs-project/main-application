import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownButtonModule } from '@progress/kendo-angular-buttons';
import { EntryTypeDescriptionPipe } from '../../../../pipes/entry-type-description.pipe';
import { EntryTypeIconPipe } from '../../../../pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '../../../../pipes/entry-type-title.pipe';

@Component({
  standalone: true,
  selector: 'wbs-entry-create-button',
  templateUrl: './entry-create-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DropDownButtonModule,
    EntryTypeDescriptionPipe,
    EntryTypeIconPipe,
    EntryTypeTitlePipe,
    FontAwesomeModule,
    TranslateModule,
  ],
})
export class EntryCreateButtonComponent {
  readonly typeChosen = output<string>();
  readonly createMenu = ['project', 'phase', 'task'];
}
