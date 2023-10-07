import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { Role } from '@wbs/core/models';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { PermissionsState } from '@wbs/main/states';
import { first, skipWhile } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'wbs-role-filter-list',
  templateUrl: './role-filter-list.component.html',
  styleUrls: ['./role-filter-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MultiSelectModule, NgIf, RoleListPipe, TranslateModule],
})
export class RoleFilterListComponent implements OnInit {
  @Output() readonly valueChanged = new EventEmitter<string[]>();

  private readonly roleDefintions = this.store.select(
    PermissionsState.roleDefinitions
  );

  readonly roles = toSignal(this.roleDefintions);
  readonly values = signal<Role[]>([]);

  constructor(readonly store: Store) {}

  ngOnInit(): void {
    this.roleDefintions
      .pipe(
        skipWhile((list) => list == undefined),
        first()
      )
      .subscribe((roles) => {
        this.values.set(roles);
      });
  }

  onlyRole(e: Event, role: Role): void {
    e.stopPropagation();

    this.set([role]);
  }

  public valueChange(value: Role[]): void {
    this.set(value);
  }

  private set(value: Role[]): void {
    this.values.set(value);
    this.valueChanged.emit(value.map((r) => r.id));
  }
}
