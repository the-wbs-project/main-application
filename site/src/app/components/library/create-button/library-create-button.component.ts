import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonsModule,
  DropDownButtonModule,
} from '@progress/kendo-angular-buttons';
import { EntryTypeDescriptionPipe } from '@wbs/pipes/entry-type-description.pipe';
import { EntryTypeIconPipe } from '@wbs/pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '@wbs/pipes/entry-type-title.pipe';

@Component({
  standalone: true,
  selector: 'wbs-library-create-button',
  templateUrl: './library-create-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonsModule,
    DropDownButtonModule,
    EntryTypeDescriptionPipe,
    EntryTypeIconPipe,
    EntryTypeTitlePipe,
    FontAwesomeModule,
    TranslateModule,
  ],
})
export class LibraryCreateButtonComponent {
  readonly typeChosen = output<string>();
  readonly createMenu = ['project', 'phase', 'task'];
  readonly plusIcon = faPlus;
}
