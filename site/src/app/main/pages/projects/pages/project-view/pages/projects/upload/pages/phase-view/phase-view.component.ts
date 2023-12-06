import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList } from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-thin-svg-icons';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Resources } from '@wbs/core/services';
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
