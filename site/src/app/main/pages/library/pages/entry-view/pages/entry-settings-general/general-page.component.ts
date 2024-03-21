import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk, faRobot } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ListItem } from '@wbs/core/models';
import { InfoMessageComponent } from '@wbs/main/components/info-message.component';
import { ProjectCategoryDropdownComponent } from '@wbs/main/components/project-category-dropdown';
import { VisiblitySelectionComponent } from '../../../../components/visiblity-selection';
import { DescriptionAiDialogComponent } from '../../components/entry-description-ai-dialog';
import { EntryService, EntryState } from '../../services';

@Component({
  standalone: true,
  templateUrl: './general-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DescriptionAiDialogComponent,
    DialogModule,
    EditorModule,
    FontAwesomeModule,
    FormsModule,
    InfoMessageComponent,
    LabelModule,
    ProjectCategoryDropdownComponent,
    TextBoxModule,
    TranslateModule,
    VisiblitySelectionComponent,
  ],
})
export class GeneralComponent {
  private readonly service = inject(EntryService);
  readonly state = inject(EntryState);

  readonly faRobot = faRobot;
  readonly faFloppyDisk = faFloppyDisk;
  readonly askAi = model(true);
  readonly categories = input.required<ListItem[]>();
  readonly canSave = computed(() => {
    const version = this.state.version();

    if ((version?.title ?? '').length === 0) return false;

    return true;
  });

  save(): void {
    this.service
      .generalSaveAsync(this.state.entry()!, this.state.version()!)
      .subscribe();
  }
}
