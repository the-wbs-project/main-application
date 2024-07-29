import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DescriptionAiDialogComponent } from '@wbs/components/description-ai-dialog';
import { ResizedCssDirective } from '@wbs/core/directives/resize-css.directive';
import { LIBRARY_CLAIMS } from '@wbs/core/models';
import {
  AiPromptService,
  CategoryService,
  SaveService,
} from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { DescriptionCardComponent } from '@wbs/components/description-card';
import { DisciplineCardComponent } from '@wbs/components/discipline-card';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { SafeHtmlPipe } from '@wbs/pipes/safe-html.pipe';
import { EntryStore } from '@wbs/core/store';
import { delay, tap } from 'rxjs/operators';
import { DetailsCardComponent } from './components/details-card';

@Component({
  standalone: true,
  templateUrl: './about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DescriptionCardComponent,
    DescriptionAiDialogComponent,
    DisciplineCardComponent,
    DetailsCardComponent,
    ResizedCssDirective,
    SafeHtmlPipe,
    TranslateModule,
  ],
  providers: [AiPromptService],
})
export class AboutPageComponent implements OnInit {
  private readonly category = inject(CategoryService);
  private readonly prompt = inject(AiPromptService);
  private readonly entryService = inject(EntryService);
  readonly store = inject(EntryStore);

  readonly askAi = model(false);
  readonly descriptionEditMode = model(false);
  readonly claims = input.required<string[]>();
  readonly descriptionSave = new SaveService();
  readonly descriptionAiStartingDialog = computed(() =>
    this.prompt.libraryEntryDescription(
      this.store.entry(),
      this.store.version(),
      this.store.viewModels()
    )
  );
  readonly disciplines = computed(() =>
    this.category.buildViewModels(this.store.version()!.disciplines)
  );

  readonly UPDATE_CLAIM = LIBRARY_CLAIMS.UPDATE;

  descriptionChange(description: string): void {
    this.descriptionSave
      .call(
        this.entryService.descriptionChangedAsync(description).pipe(
          delay(1000),
          tap(() => this.descriptionEditMode.set(false))
        )
      )
      .subscribe();
  }

  aiChangeSaved(description: string): void {
    this.askAi.set(false);
    this.descriptionEditMode.set(false);
    this.descriptionChange(description);
  }

  ngOnInit(): void {
    let tasks = this.store.viewModels();
    let text = '';

    for (const task of tasks ?? []) {
      for (let part of task.levels ?? []) text += '  ';
      text += `${task.levelText}: ${task.title}\n`;
    }
  }
}
