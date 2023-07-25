import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadProjectFile } from '../../actions';
import { ResultStats } from '../../models';
import { ProjectUploadState } from '../../states';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  templateUrl: './results-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FontAwesomeModule, RouterModule, TranslateModule]
})
export class ResultsViewComponent implements OnInit {
  @Select(ProjectUploadState.errors) errors$!: Observable<string[] | undefined>;
  @Select(ProjectUploadState.loadingFile) loading$!: Observable<boolean>;
  @Select(ProjectUploadState.stats) stats$!: Observable<
    ResultStats | undefined
  >;
  readonly isMpp$: Observable<boolean>;
  readonly isXlsx$: Observable<boolean>;
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;

  constructor(private readonly store: Store) {
    const obs = this.store.select(ProjectUploadState.fileType);

    this.isMpp$ = obs.pipe(map((ext) => ext === 'project'));
    this.isXlsx$ = obs.pipe(map((ext) => ext === 'excel'));
  }

  ngOnInit(): void {
    this.store.dispatch(new LoadProjectFile());
  }
}
