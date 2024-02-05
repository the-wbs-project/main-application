import { NgClass, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AiModel } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { ResizedCssDirective } from '@wbs/main/directives/resize-css.directive';
import { SafeHtmlPipe } from '@wbs/main/pipes/safe-html.pipe';
import { DescriptionChanged } from '../../../actions';
import { EntryViewState } from '../../../states';
import { DescriptionCardComponent } from './components/description-card/description-card.component';

@Component({
  standalone: true,
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DescriptionCardComponent,
    NgClass,
    ResizedCssDirective,
    SafeHtmlPipe,
    TranslateModule,
    UpperCasePipe,
  ],
})
export class AboutPageComponent {
  readonly entry = this.store.select(EntryViewState.entry);
  readonly version = this.store.select(EntryViewState.version);

  constructor(private readonly store: SignalStore) {}

  descriptionChange(description: string): void {
    this.store.dispatch(new DescriptionChanged(description));
  }
}
