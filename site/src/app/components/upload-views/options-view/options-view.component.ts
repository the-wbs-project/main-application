import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-upload-options-view',
  templateUrl: './options-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, TranslateModule],
})
export class UploadOptionsViewComponent {
  readonly selected = output<'append' | 'overwrite'>();
}
