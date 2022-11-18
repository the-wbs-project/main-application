import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { PrepUploadToSave } from '../../actions';
import { ProjectUploadState } from '../../states';

@UntilDestroy()
@Component({
  templateUrl: './save-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaveViewComponent implements OnInit {
  readonly saving$ = new BehaviorSubject<boolean>(true);
  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new PrepUploadToSave());
    this.store
      .select(ProjectUploadState.saving)
      .pipe(untilDestroyed(this))
      .subscribe((saving) => this.saving$.next(saving));
  }
}
