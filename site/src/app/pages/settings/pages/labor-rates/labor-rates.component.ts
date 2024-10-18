import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule, DialogService } from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { TitleService } from '@wbs/core/services';
import { LaborRatesStore } from './services';

@Component({
  standalone: true,
  templateUrl: './labor-rates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    FontAwesomeModule,
    FormsModule,
    TextBoxModule,
    TranslateModule,
  ],
})
export class LaborRatesComponent {
  private readonly dialog = inject(DialogService);

  readonly store = inject(LaborRatesStore);
  readonly faPlus = faPlus;
  readonly faSpinner = faSpinner;

  constructor(title: TitleService) {
    effect(() => this.store.initialize(), {
      allowSignalWrites: true,
    });
    title.setTitle([{ text: 'General.Settings' }, { text: 'General.Members' }]);
  }
}
