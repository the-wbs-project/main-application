import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-upload-options-view',
  templateUrl: './options-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
})
export class UploadOptionsViewComponent {
  readonly selected = output<'append' | 'overwrite'>();
}
