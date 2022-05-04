import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ListItem } from '@wbs/shared/models';
import { MetadataState } from '@wbs/shared/states';
import { Observable } from 'rxjs';

@Component({
  selector: 'wbs-node-phase-picker',
  templateUrl: './phase-picker.component.html',
  styleUrls: ['../flexing.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PhasePickerComponent {
  @Select(MetadataState.disciplineCategories) disciplines$!: Observable<
    ListItem[]
  >;
  disciplineIds: string[] = [];

  constructor(private readonly store: Store) {}

  back() {
    //
  }

  go() {
    //
  }
}
