import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ListItem } from '@wbs/models';
import { MetadataState } from '@wbs/states';
import { Observable } from 'rxjs';

@Component({
  selector: 'wbs-node-phase-picker',
  templateUrl: './phase-picker.component.html',
  styleUrls: ['../flexing.scss'],
  preserveWhitespaces: false,
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
