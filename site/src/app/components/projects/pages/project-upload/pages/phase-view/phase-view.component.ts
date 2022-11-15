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

@Component({
  templateUrl: './phase-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseViewComponent {
  @Select(MetadataState.phaseCategories) categories$!: Observable<ListItem[]>;
  @Select(ProjectUploadState.phaseList) phaseList$!: Observable<
    PhaseListItem[]
  >;
  readonly faCircle = faCircle;
  readonly faList = faList;

  constructor(private readonly store: Store) {}

  nav(results: PhaseListItem[]): void {
    this.store.dispatch(new PhasesCompleted(results));
  }
}
