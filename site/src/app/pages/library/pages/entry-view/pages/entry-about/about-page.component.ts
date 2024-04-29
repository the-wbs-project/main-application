import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ResizedCssDirective } from '@wbs/core/directives/resize-css.directive';
import { LIBRARY_CLAIMS, ListItem, SaveState } from '@wbs/core/models';
import { EntryService } from '@wbs/core/services';
import { DescriptionCardComponent } from '@wbs/main/components/description-card';
import { DisciplineCardComponent } from '@wbs/main/components/discipline-card';
import { DescriptionAiDialogComponent } from '@wbs/main/components/entry-description-ai-dialog';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { SafeHtmlPipe } from '@wbs/pipes/safe-html.pipe';
import { EntryStore } from '@wbs/store';
import { delay, tap } from 'rxjs/operators';
import { DetailsCardComponent } from './components/details-card';

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
    ResizedCssDirective,
    SafeHtmlPipe,
    TranslateModule,
  ],
})
export class AboutPageComponent {
  private readonly entryService = inject(EntryService);
  readonly entryStore = inject(EntryStore);

  readonly askAi = model(false);
  readonly descriptionEditMode = model(false);
  readonly claims = input.required<string[]>();
  readonly disciplines = input.required<ListItem[]>();
  readonly descriptionSaveState = signal<SaveState>('ready');
  readonly descriptionAiStartingDialog = computed(() => {
    return `Can you provide me with a one paragraph description of a phase of a work breakdown structure titled '${
      this.entryStore.version()?.title
    }'?`;
  });

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
