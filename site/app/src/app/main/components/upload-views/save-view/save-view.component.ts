import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-upload-save-view',
  templateUrl: './save-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, RouterModule, TranslateModule],
})
export class UploadSaveViewComponent {
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly url = input.required<string[]>();
  readonly saving = input.required<boolean>();
}
