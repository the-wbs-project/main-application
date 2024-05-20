import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ImportResultStats } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-upload-results-view',
  templateUrl: './results-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, RouterModule, TranslateModule],
})
export class UploadResultsViewComponent {
  readonly errors = input.required<string[] | undefined>();
  readonly loading = input.required<boolean | undefined>();
  readonly stats = input.required<ImportResultStats | undefined>();
  readonly fileType = input.required<string | undefined>();
  readonly isMpp = computed(() => this.fileType() === 'project');
  readonly isXlsx = computed(() => this.fileType() === 'excel');
  readonly lines = computed(() => {
    const stats = this.stats();

    if (!stats) return [];
    return [
      { text: 'General.Tasks', value: stats.tasks },
      { text: 'General.Phases', value: stats.phases },
      { text: 'General.People', value: stats.people },
    ];
  });
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
}
