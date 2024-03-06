import { UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { SignalStore } from '@wbs/core/services';
import { DescriptionCardComponent } from '@wbs/main/components/description-card';
import { ResizedCssDirective } from '@wbs/main/directives/resize-css.directive';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { EntryService } from '../../services';
import { EntryViewState } from '../../states';
import { DescriptionAiDialogComponent } from '../../components/entry-description-ai-dialog';
import { DetailsCardComponent } from './components/details-card';

@Component({
  standalone: true,
  templateUrl: './about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DescriptionCardComponent,
    DescriptionAiDialogComponent,
    DetailsCardComponent,
    DialogModule,
    ResizedCssDirective,
    SafeHtmlPipe,
    TranslateModule,
    UpperCasePipe,
  ],
})
export class AboutPageComponent {
  private readonly store = inject(SignalStore);
  private readonly entryService = inject(EntryService);

  readonly askAi = model(false);
  readonly descriptionEditMode = model(false);
  readonly entry = this.store.select(EntryViewState.entry);
  readonly version = this.store.select(EntryViewState.version);

  descriptionChange(description: string): void {
    this.entryService.descriptionChangedAsync(description).subscribe();
  }

  aiChangeSaved(description: string): void {
    this.askAi.set(false);
    this.descriptionEditMode.set(false);
    this.descriptionChange(description);
  }
}
