import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList } from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-thin-svg-icons';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Resources, SignalStore } from '@wbs/core/services';
import { PhaseLabelPipe } from '@wbs/main/pipes/phase-label.pipe';
import { CategoryMatchListComponent } from '../../../../../../../components/category-match-list.component';
import { PhasesCompleted } from '../../actions';
import { PhaseListItem } from '../../models';
import { ProjectUploadState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './phase-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryMatchListComponent,
    FontAwesomeModule,
    NgbAlertModule,
    PhaseLabelPipe,
    TranslateModule,
  ],
})
export class PhaseViewComponent {
  readonly faCircle = faCircle;
  readonly faList = faList;
  readonly phases = input.required<{ id: string; label: string }[]>();
  readonly phaseList = this.store.select(ProjectUploadState.phaseList);
  readonly project = this.store.select(ProjectUploadState.current);

  constructor(
    private readonly resources: Resources,
    private readonly store: SignalStore
  ) {}

  nav(results: PhaseListItem[]): void {
    this.store.dispatch(new PhasesCompleted(results));
  }

  convert(values: { label: string }[]): string {
    return values.map((v) => this.resources.get(v.label)).join(', ');
  }
}
