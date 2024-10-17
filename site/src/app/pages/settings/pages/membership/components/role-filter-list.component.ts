import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  output,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { Role } from '@wbs/core/models';
import { MetadataStore } from '@wbs/core/store';
import { RoleListPipe } from '@wbs/pipes/role-list.pipe';

@Component({
  standalone: true,
  selector: 'wbs-role-filter-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MultiSelectModule, RoleListPipe, TranslateModule],
  template: `<kendo-multiselect
    kendoMultiSelectSummaryTag
    [checkboxes]="true"
    [autoClose]="false"
    [data]="roles"
    [value]="values()"
    adaptiveMode="auto"
    textField="abbreviation"
    valueField="id"
    (valueChange)="changed($event)"
  >
    <ng-template kendoMultiSelectGroupTagTemplate let-dataItems>
      {{ dataItems | roleList : true }}
    </ng-template>
    <ng-template kendoMultiSelectItemTemplate let-dataItem>
      <div class="role-item">
        <span class="d-inline-block wd-80">
          {{ dataItem.abbreviation | translate }}
        </span>
      </div>
    </ng-template>
  </kendo-multiselect>`,
})
export class RoleFilterListComponent implements OnInit {
  readonly roles = inject(MetadataStore).roles.definitions;
  readonly values = signal<Role[]>([]);
  readonly valueChanged = output<string[]>();

  ngOnInit(): void {
    this.values.set(structuredClone(this.roles));
  }

  public changed(value: Role[]): void {
    this.set(value);
  }

  private set(value: Role[]): void {
    this.values.set([...value]);
    this.valueChanged.emit(value.map((r) => r.id));
  }
}
