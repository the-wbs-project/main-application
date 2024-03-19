import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { SignalStore } from '@wbs/core/services';
import { DescriptionCardComponent } from '@wbs/main/components/description-card';
import { ResizedCssDirective } from '@wbs/main/directives/resize-css.directive';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { EntryService, EntryState } from '../../services';
import { DescriptionAiDialogComponent } from '../../components/entry-description-ai-dialog';
import { DetailsCardComponent } from './components/details-card';
import { DisciplineCardComponent } from '@wbs/main/components/discipline-card';
import { LIBRARY_CLAIMS, ListItem } from '@wbs/core/models';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';

@Component({
  standalone: true,
  templateUrl: './about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckPipe,
    DescriptionCardComponent,
    DescriptionAiDialogComponent,
    DisciplineCardComponent,
    DetailsCardComponent,
    DialogModule,
    ResizedCssDirective,
    SafeHtmlPipe,
    TranslateModule,
    UpperCasePipe,
  ],
})
export class AboutPageComponent {
  private readonly entryService = inject(EntryService);
  readonly state = inject(EntryState);

  readonly askAi = model(false);
  readonly descriptionEditMode = model(false);
  readonly claims = input.required<string[]>();
  readonly disciplines = input.required<ListItem[]>();

  readonly UPDATE_CLAIM = LIBRARY_CLAIMS.UPDATE;

  descriptionChange(description: string): void {
    this.entryService.descriptionChangedAsync(description).subscribe();
  }

  aiChangeSaved(description: string): void {
    this.askAi.set(false);
    this.descriptionEditMode.set(false);
    this.descriptionChange(description);
  }
}
