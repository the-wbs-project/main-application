import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadProjectFile } from '../../actions';
import { ResultStats } from '../../models';
import { ProjectUploadState } from '../../states';

@Component({
  templateUrl: './results-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
