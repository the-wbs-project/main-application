import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { PrepUploadToSave } from '../../actions';
import { ProjectUploadState } from '../../states';

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
      .pipe(takeUntilDestroyed())
      .subscribe((saving) => this.saving$.next(saving));
  }
}
