import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  output,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { Role } from '@wbs/core/models';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';

@Component({
  standalone: true,
  selector: 'wbs-role-filter-list',
  templateUrl: './role-filter-list.component.html',
  styleUrls: ['./role-filter-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MultiSelectModule, RoleListPipe, TranslateModule],
})
export class RoleFilterListComponent implements OnInit {
  readonly roles = input.required<Role[]>();

  readonly valueChanged = output<string[]>();

  readonly values = signal<Role[]>([]);

  ngOnInit(): void {
    this.values.set(structuredClone(this.roles()));
  }

  onlyRole(e: Event, role: Role): void {
    e.stopPropagation();

    this.set([role]);
  }

  public changed(value: Role[]): void {
    this.set(value);
  }

  private set(value: Role[]): void {
    this.values.set([...value]);
    this.valueChanged.emit(value.map((r) => r.id));
  }
}
