import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { PrepUploadToSave } from '../../actions';
import { ProjectUploadState } from '../../states';
import { toSignal } from '@angular/core/rxjs-interop';

@UntilDestroy()
@Component({
  standalone: true,
  templateUrl: './save-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FontAwesomeModule, RouterModule, TranslateModule],
})
export class SaveViewComponent implements OnInit {
  readonly current = toSignal(this.store.select(ProjectUploadState.current));
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
