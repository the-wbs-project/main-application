import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { OptionsViewButtonComponent } from './options-view-button.component';

@Component({
  standalone: true,
  selector: 'wbs-options-view',
  templateUrl: './options-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, OptionsViewButtonComponent, TranslateModule],
})
export class OptionsViewComponent {
  readonly libraryType = input.required<string>();
  readonly projectAsTask = model.required<boolean | undefined>();
  readonly onlyImportSubtasks = model.required<boolean | undefined>();
}
