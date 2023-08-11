import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { LoadProjectFile } from '../../actions';
import { ProjectUploadState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './results-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FontAwesomeModule, RouterModule, TranslateModule],
})
export class ResultsViewComponent implements OnInit {
  readonly errors = toSignal(this.store.select(ProjectUploadState.errors));
  readonly loading = toSignal(
    this.store.select(ProjectUploadState.loadingFile)
  );
  readonly stats = toSignal(this.store.select(ProjectUploadState.stats));
  readonly fileType = toSignal(this.store.select(ProjectUploadState.fileType));
  readonly isMpp = computed(() => this.fileType() === 'project');
  readonly isXlsx = computed(() => this.fileType() === 'excel');
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadProjectFile());
  }
}
