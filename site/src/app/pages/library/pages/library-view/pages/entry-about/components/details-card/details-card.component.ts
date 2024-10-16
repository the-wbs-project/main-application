import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NumberPipe } from '@progress/kendo-angular-intl';
import { LibraryTypeTextComponent } from '@wbs/components/_utils/library-type-text.component';
import { VisibilityTextComponent } from '@wbs/components/_utils/visibility-text.component';
import { EditableTextComponent } from '@wbs/components/editable-text';
import { ProjectCategoryEditorComponent } from '@wbs/components/project-category-editor';
import { SaveService } from '@wbs/core/services';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { LibraryStatusPipe } from '@wbs/pipes/library-status.pipe';
import { VersionPipe } from '@wbs/pipes/version.pipe';
import { LibraryService } from '../../../../services';
import { LibraryStore } from '../../../../store';

@Component({
  standalone: true,
  selector: 'wbs-details-card',
  templateUrl: './details-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card dashboard-card' },
  imports: [
    DateTextPipe,
    EditableTextComponent,
    LibraryStatusPipe,
    LibraryTypeTextComponent,
    NumberPipe,
    ProjectCategoryEditorComponent,
    TranslateModule,
    VersionPipe,
    VisibilityTextComponent,
  ],
})
export class DetailsCardComponent {
  private readonly service = inject(LibraryService);

  readonly store = inject(LibraryStore);
  readonly editAlias = signal(false);
  readonly saveAlias = new SaveService();
  readonly saveTitle = new SaveService();
  readonly saveProjectCategory = new SaveService();

  aliasChanged(alias: string): void {
    this.saveAlias
      .call(this.service.versionAliasChangedAsync(alias ?? ''))
      .subscribe();
  }

  titleChanged(title: string): void {
    this.saveTitle
      .call(this.service.titleChangedAsync(title ?? ''))
      .subscribe();
  }

  projectCategoryChanged(category: string | undefined): void {
    this.saveProjectCategory
      .call(this.service.categoryChangedAsync(category ?? ''))
      .subscribe();
  }
}
