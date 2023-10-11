import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDownload, faGear, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { PROJECT_CLAIMS, RecordResource } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { ActionIconListComponent } from '@wbs/main/components/action-icon-list.component';
import { SortArrowComponent } from '@wbs/main/components/sort-arrow.component';
import { SortableDirective } from '@wbs/main/directives/table-sorter.directive';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { TableProcessPipe } from '@wbs/main/pipes/table-process.pipe';
import { DialogService, TableHelper } from '@wbs/main/services';
import { ResourceTypeDownloadablePipe } from '../../pipes/resource-type-downloadable.pipe';
import { ResourceTypeIconPipe } from '../../pipes/resource-type-icon.pipe';
import { ResourceTypeNamePipe } from '../../pipes/resource-type-name.pipe';
import { CheckPipe } from '../../../../pipes/check.pipe';
import { ResourceViewLinkComponent } from '../resource-view-link/resource-view-link.component';

@Component({
  standalone: true,
  selector: 'wbs-resource-list',
  templateUrl: './resource-list.component.html',
  providers: [TableHelper],
  imports: [
    ActionIconListComponent,
    DateTextPipe,
    FontAwesomeModule,
    NgClass,
    NgFor,
    NgIf,
    ResourceTypeDownloadablePipe,
    ResourceTypeIconPipe,
    ResourceTypeNamePipe,
    ResourceViewLinkComponent,
    SortableDirective,
    SortArrowComponent,
    TableProcessPipe,
    TranslateModule,
    CheckPipe,
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
  readonly faTrash = faTrash;
  readonly faDownload = faDownload;
  readonly menu = [];

  constructor(
    private readonly dialogService: DialogService,
    private readonly messages: Messages,
    private readonly store: Store
  ) {}

  view(resource: RecordResource): void {
    //
  }

  actionClicked(resource: RecordResource, action: string): void {
    /*
    if (action === 'edit') { 
      this.dialogService
        .openDialog<Member>(
          EditMemberComponent,
          {
            size: 'lg',
          },
          structuredClone(member)
        )
        .subscribe((changedMember) => {
          if (!changedMember) return;

          this.store.dispatch(
            new UpdateMemberRoles(changedMember.id, changedMember.roles)
          );
        });
    } else if (action === 'remove') {
      this.messages.confirm
        .show('General.Confirmation', 'OrgSettings.MemberRemoveConfirm')
        .pipe(first())
        .subscribe((answer) => {
          if (answer) {
            this.store.dispatch(new RemoveMemberFromOrganization(member.id));
          }
        });
    }*/
  }

  updateState(): void {
    const state = <State>{
      sort: this.state().sort,
    };
    const filters: (CompositeFilterDescriptor | FilterDescriptor)[] = [];

    /*
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
