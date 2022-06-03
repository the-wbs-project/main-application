import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { DataStateChangeEvent } from '@progress/kendo-angular-treelist';
import { process, State as kendoState } from '@progress/kendo-data-query';
import { User } from '@wbs/shared/models';
import { BehaviorSubject, map } from 'rxjs';

@Component({
  selector: 'app-settings-user-grid',
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class UserGridComponent implements OnChanges {
  @Input() users: User[] | null | undefined;

  readonly data$ = new BehaviorSubject<GridDataResult | null>(null);
  readonly state$ = new BehaviorSubject<kendoState>({
    sort: [],
    skip: 0,
    take: 100,
    filter: {
      filters: [],
      logic: 'and',
    },
  });
  readonly filter$ = this.state$.pipe(map((s) => s.filter!));
  readonly sort$ = this.state$.pipe(map((s) => s.sort!));

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['users']) {
      this.setData();
    }
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state$.next(state);
    this.setData();
  }

  private setData() {
    this.data$.next(process(this.users ?? [], this.state$.getValue()));
  }
}
