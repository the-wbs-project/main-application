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
import { EntryService, EntryTaskService } from '@wbs/core/services/library';
import { DescriptionCardComponent } from '@wbs/components/description-card';
import { DisciplineCardComponent } from '@wbs/components/discipline-card';
import { SafeHtmlPipe } from '@wbs/pipes/safe-html.pipe';
import { EntryStore } from '@wbs/core/store';
import { CategorySelection } from '@wbs/core/view-models';
import { of } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { ContributorCardComponent } from './components/contributor-card';
import { DetailsCardComponent } from './components/details-card';

@Component({
  standalone: true,
  templateUrl: './about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ContributorCardComponent,
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
  private readonly taskService = inject(EntryTaskService);
  readonly store = inject(EntryStore);

  readonly askAi = model(false);
  readonly descriptionEditMode = model(false);
  readonly claims = input.required<string[]>();
  readonly descriptionSave = new SaveService();
  readonly disciplineSave = new SaveService();
  readonly descriptionAiStartingDialog = computed(() =>
    this.prompt.libraryEntryDescription(
      this.store.version(),
      this.store.viewModels()
    )
  );
  readonly disciplines = computed(() =>
    this.category.buildViewModels(this.store.version()!.disciplines)
  );
  readonly editDisciplines = computed(() =>
    this.category.buildDisciplines(this.store.version()!.disciplines)
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

  ngOnInit(): void {}

  saveDisciplines(disciplines: CategorySelection[]): void {
    const version = this.store.version()!;
    const disciplinesResults = this.category.extract(
      disciplines,
      version.disciplines ?? []
    );

    version.disciplines = disciplinesResults.categories;

    this.disciplineSave
      .call(this.entryService.saveAsync(version))
      .pipe(
        switchMap(() =>
          disciplinesResults.removedIds.length === 0
            ? of('hello')
            : this.taskService.removeDisciplinesFromAllTasksAsync(
                disciplinesResults.removedIds
              )
        )
      )
      .subscribe();
  }
}
