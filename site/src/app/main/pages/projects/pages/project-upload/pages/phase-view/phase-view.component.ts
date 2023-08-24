import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList } from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-thin-svg-icons';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { ListItem } from '@wbs/core/models';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';
import { CategoryLabelListPipe } from '@wbs/main/pipes/category-label-list.pipe';
import { JoinPipe } from '@wbs/main/pipes/join.pipe';
import { MetadataState } from '@wbs/main/states';
import { Observable } from 'rxjs';
import { PhasesCompleted } from '../../actions';
import { PhaseListItem } from '../../models';
import { ProjectUploadState } from '../../states';
import { Resources } from '@wbs/core/services';

@Component({
  standalone: true,
  templateUrl: './phase-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryLabelListPipe,
    CategoryLabelPipe,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    JoinPipe,
    MultiSelectModule,
    NgbAlertModule,
    TranslateModule,
  ],
})
export class PhaseViewComponent {
  @Select(MetadataState.phases) categories$!: Observable<ListItem[]>;
  @Select(ProjectUploadState.phaseList) phaseList$!: Observable<
    PhaseListItem[]
  >;
  readonly faCircle = faCircle;
  readonly faList = faList;

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
