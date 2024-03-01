import { NgClass, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SignalStore } from '@wbs/core/services';
import { ResizedCssDirective } from '@wbs/main/directives/resize-css.directive';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { EntryService } from '../../services';
import { EntryViewState } from '../../states';
import { DescriptionCardComponent } from './components/description-card';
import { DetailsCardComponent } from './components/details-card';

@Component({
  standalone: true,
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DescriptionCardComponent,
    DetailsCardComponent,
    NgClass,
    ResizedCssDirective,
    SafeHtmlPipe,
    TranslateModule,
    UpperCasePipe,
  ],
})
export class AboutPageComponent {
  private readonly store = inject(SignalStore);
  private readonly entryService = inject(EntryService);

  readonly entry = this.store.select(EntryViewState.entry);
  readonly version = this.store.select(EntryViewState.version);

  descriptionChange(description: string): void {
    this.entryService.descriptionChangedAsync(description).subscribe();
  }
}
