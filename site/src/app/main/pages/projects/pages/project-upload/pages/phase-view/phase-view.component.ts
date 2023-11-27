import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList } from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-thin-svg-icons';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Resources } from '@wbs/core/services';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';
import { CategoryLabelListPipe } from '@wbs/main/pipes/category-label-list.pipe';
import { PhasesCompleted } from '../../actions';
import { PhaseListItem } from '../../models';
import { ProjectUploadState } from '../../states';
import { PhaseMatchListComponent } from './phase-match-list.component';

@Component({
  standalone: true,
  templateUrl: './phase-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryLabelListPipe,
    CategoryLabelPipe,
    FontAwesomeModule,
    NgbAlertModule,
    PhaseMatchListComponent,
    TranslateModule,
  ],
})
export class PhaseViewComponent {
  @Input() phases!: { id: string; label: string }[];

  readonly faCircle = faCircle;
  readonly faList = faList;
  readonly phaseList = toSignal(
    this.store.select(ProjectUploadState.phaseList)
  );
  readonly project = toSignal(this.store.select(ProjectUploadState.current));

  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  nav(results: PhaseListItem[]): void {
    this.store.dispatch(new PhasesCompleted(results));
  }

  convert(values: { label: string }[]): string {
    return values.map((v) => this.resources.get(v.label)).join(', ');
  }
}
