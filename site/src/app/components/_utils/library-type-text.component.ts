import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { EntryTypeIconPipe } from '@wbs/pipes/entry-type-icon.pipe';
import { EntryTypeTitlePipe } from '@wbs/pipes/entry-type-title.pipe';

@Component({
  selector: 'wbs-library-type-text',
  standalone: true,
  imports: [
    EntryTypeIconPipe,
    EntryTypeTitlePipe,
    FontAwesomeModule,
    TranslateModule,
  ],
  template: `<span class="d-inline-block wd-20 text-center">
      <fa-icon [icon]="type() | entryTypeIcon" class="d-none d-sm-inline" />
    </span>
    {{ type() | entryTypeTitle | translate }}`,
})
export class LibraryTypeTextComponent {
  readonly type = input.required<string>();
}
