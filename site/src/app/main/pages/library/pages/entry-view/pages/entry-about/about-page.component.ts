import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LIBRARY_CLAIMS, ListItem } from '@wbs/core/models';
import { DescriptionCardComponent } from '@wbs/main/components/description-card';
import { DisciplineCardComponent } from '@wbs/main/components/discipline-card';
import { ResizedCssDirective } from '@wbs/main/directives/resize-css.directive';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { TaskModalService } from '@wbs/main/services';
import { DescriptionAiDialogComponent } from '../../components/entry-description-ai-dialog';
import { EntryService, EntryState } from '../../services';
import { DetailsCardComponent } from './components/details-card';
import { delay, tap } from 'rxjs/operators';

@Component({
  standalone: true,
  templateUrl: './about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TaskModalService],
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
  ],
})
export class AboutPageComponent {
  private readonly entryService = inject(EntryService);

  readonly modal = inject(TaskModalService);
  readonly state = inject(EntryState);

  readonly askAi = model(false);
  readonly descriptionEditMode = model(false);
  readonly claims = input.required<string[]>();
  readonly disciplines = input.required<ListItem[]>();
  readonly descriptionSaveState = signal<'ready' | 'saving' | 'saved'>('ready');

  readonly UPDATE_CLAIM = LIBRARY_CLAIMS.UPDATE;

  descriptionChange(description: string): void {
    this.descriptionSaveState.set('saving');

    this.entryService
      .descriptionChangedAsync(description)
      .pipe(
        delay(1000),
        tap(() => {
          this.descriptionEditMode.set(false);
          this.descriptionSaveState.set('saved');
        }),
        delay(5000)
      )
      .subscribe(() => this.descriptionSaveState.set('ready'));
  }

  aiChangeSaved(description: string): void {
    this.askAi.set(false);
    this.descriptionEditMode.set(false);
    this.descriptionChange(description);
  }
}
