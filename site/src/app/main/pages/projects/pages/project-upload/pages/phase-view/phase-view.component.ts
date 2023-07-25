import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faList } from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-thin-svg-icons';
import { Select, Store } from '@ngxs/store';
import { ListItem } from '@wbs/core/models';
import { MetadataState } from '@wbs/core/states';
import { Observable } from 'rxjs';
import { PhasesCompleted } from '../../actions';
import { PhaseListItem } from '../../models';
import { ProjectUploadState } from '../../states';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoryLabelListPipe } from '@wbs/main/pipes/category-label-list.pipe';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';
import { JoinPipe } from '@wbs/main/pipes/join.pipe';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  templateUrl: './phase-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryLabelListPipe, CategoryLabelPipe, CommonModule, FontAwesomeModule, FormsModule, JoinPipe, MultiSelectModule, NgbAlertModule, TranslateModule]
})
export class PhaseViewComponent {
  @Select(MetadataState.phaseCategories) categories$!: Observable<ListItem[]>;
  @Select(ProjectUploadState.phaseList) phaseList$!: Observable<
    PhaseListItem[]
  >;
  readonly faCircle = faCircle;
  readonly faList = faList;

  constructor(private readonly store: Store) { }

  nav(results: PhaseListItem[]): void {
    this.store.dispatch(new PhasesCompleted(results));
  }
}
