import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { SignalStore } from '@wbs/core/services';
import { LoadProjectFile } from '../../actions';
import { EntryUploadState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './results-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, RouterModule, TranslateModule],
})
export class ResultsViewComponent implements OnInit {
  private readonly store = inject(SignalStore);

  readonly errors = this.store.select(EntryUploadState.errors);
  readonly loading = this.store.select(EntryUploadState.loadingFile);
  readonly stats = this.store.select(EntryUploadState.stats);
  readonly fileType = this.store.select(EntryUploadState.fileType);
  readonly isMpp = computed(() => this.fileType() === 'project');
  readonly isXlsx = computed(() => this.fileType() === 'excel');
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;

  ngOnInit(): void {
    this.store.dispatch(new LoadProjectFile());
  }
}
