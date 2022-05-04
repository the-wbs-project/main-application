import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { PROJECT_NODE_VIEW } from '@wbs/shared/models';
import { map, Observable } from 'rxjs';
import { OtherFlagsPrevious } from '../../actions';
import { NodeCreationState } from '../../state';

@Component({
  selector: 'wbs-node-other-flags',
  templateUrl: './other-flags.component.html',
  styleUrls: ['../flexing.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OtherFlagsComponent implements AfterViewInit {
  readonly isPhase$: Observable<boolean>;
  syncWithDisciplines = false;

  constructor(private readonly store: Store) {
    this.isPhase$ = this.store
      .select(NodeCreationState.view)
      .pipe(map((view) => view === PROJECT_NODE_VIEW.PHASE));
  }

  ngAfterViewInit() {
    this.syncWithDisciplines = this.store.selectSnapshot(
      NodeCreationState.syncWithDisciplines
    );
  }

  back() {
    this.store.dispatch(new OtherFlagsPrevious());
  }

  go() {
    //this.store.dispatch(new DisciplineNext(this.disciplineIds));
  }
}
