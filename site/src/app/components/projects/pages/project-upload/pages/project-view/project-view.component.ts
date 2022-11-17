import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoadMsProjectFile } from '../../actions';
import { ResultStats } from '../../models';
import { ProjectUploadState } from '../../states';

@Component({
  templateUrl: './project-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectViewComponent implements OnInit {
  @Select(ProjectUploadState.errors) errors$!: Observable<string[] | undefined>;
  @Select(ProjectUploadState.loadingFile) loading$!: Observable<boolean>;
  @Select(ProjectUploadState.stats) stats$!: Observable<
    ResultStats | undefined
  >;
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadMsProjectFile());
  }
}
