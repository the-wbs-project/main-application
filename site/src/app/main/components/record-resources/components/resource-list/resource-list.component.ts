import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { State } from '@progress/kendo-data-query';
import { PROJECT_CLAIMS, RecordResource } from '@wbs/core/models';
import { ActionIconListComponent } from '@wbs/main/components/action-icon-list.component';
import { SortArrowComponent } from '@wbs/main/components/sort-arrow.component';
import { SortableDirective } from '@wbs/main/directives/table-sorter.directive';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { TableProcessPipe } from '@wbs/main/pipes/table-process.pipe';
import { TableHelper } from '@wbs/main/services';
import { CheckPipe } from '../../../../pipes/check.pipe';
import { ResourceTypeTextComponent } from '../resource-type-text.component';
import { ResourceViewLinkComponent } from '../resource-view-link/resource-view-link.component';

@Component({
  standalone: true,
  selector: 'wbs-resource-list',
  templateUrl: './resource-list.component.html',
  providers: [TableHelper],
  imports: [
    ActionIconListComponent,
    CheckPipe,
    DateTextPipe,
    FontAwesomeModule,
    NgClass,
    NgFor,
    NgIf,
    ResourceTypeTextComponent,
    ResourceViewLinkComponent,
    SortableDirective,
    SortArrowComponent,
    TableProcessPipe,
    TranslateModule,
  ],
})
export class ResourceListComponent {
  @Input({ required: true }) claims!: string[];
  @Input({ required: true }) list!: RecordResource[];
  @Output() readonly save = new EventEmitter<RecordResource>();

  readonly editClaim = PROJECT_CLAIMS.RESOURCES.UPDATE;
  readonly deleteClaim = PROJECT_CLAIMS.RESOURCES.DELETE;

  readonly state = signal(<State>{
    sort: [{ field: 'order', dir: 'asc' }],
  });
  readonly faGear = faGear;
  readonly menu = [];

  updateState(): void {
    const state = <State>{
      sort: this.state().sort,
    };

    /*
    const filters: (CompositeFilterDescriptor | FilterDescriptor)[] = [];

    if (this.textFilter) {
      filters.push(<CompositeFilterDescriptor>{
        logic: 'or',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: this.textFilter,
          },
          {
            field: 'email',
            operator: 'contains',
            value: this.textFilter,
          },
        ],
      });
    }
    if (this.roles.length > 0) {
      const roleFilter: CompositeFilterDescriptor = {
        logic: 'or',
        filters: [],
      };

      for (const role of this.roles) {
        roleFilter.filters.push({
          field: 'roleList',
          operator: 'contains',
          value: role.toString(),
        });
      }
      filters.push(roleFilter);
    }
    state.filter = {
      logic: 'and',
      filters,
    };
    */
    this.state.set(state);
  }
}
