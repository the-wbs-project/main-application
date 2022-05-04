import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { ListItem } from '@wbs/shared/models';
import { MetadataState } from '@wbs/shared/states';
import { Observable } from 'rxjs';
import { DisciplineNext, DisciplinePrevious } from '../../actions';
import { NodeCreationState } from '../../state';

@Component({
  selector: 'wbs-node-discipline-picker',
  templateUrl: './discipline-picker.component.html',
  styleUrls: ['../flexing.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DisciplinePickerComponent implements AfterViewInit {
  private disciplines: ListItem[] = [];
  @Select(MetadataState.disciplineCategories) disciplines$!: Observable<
    ListItem[]
  >;
  data: ListItem[] = [];
  disciplineIds: string[] = [];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
    fields: ['label'],
  };

  constructor(private readonly store: Store) {}

  ngAfterViewInit() {
    this.disciplines = this.store.selectSnapshot(
      MetadataState.disciplineCategories
    );
    this.data = [...this.disciplines];

    this.disciplineIds.push(
      ...this.store.selectSnapshot(NodeCreationState.disciplines)
    );
  }

  back() {
    this.store.dispatch(new DisciplinePrevious());
  }

  go() {
    this.store.dispatch(new DisciplineNext(this.disciplineIds));
  }

  import() {
    this.store.selectOnce(NodeCreationState.parent).subscribe((parent) => {
      console.log(parent?.disciplines);

      for (const id of parent?.disciplines ?? []) {
        if (this.disciplineIds.indexOf(id) > -1) continue;

        this.disciplineIds.push(id);
      }
    });
  }
}
