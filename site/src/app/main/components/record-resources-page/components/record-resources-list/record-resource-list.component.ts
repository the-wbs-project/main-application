import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faGear } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  ListViewComponent,
  ListViewModule,
} from '@progress/kendo-angular-listview';
import {
  DragAndDropModule,
  DragTargetContainerDirective,
  DropTargetContainerDirective,
  DropTargetEvent,
} from '@progress/kendo-angular-utils';
import { State } from '@progress/kendo-data-query';
import { PROJECT_CLAIMS, RecordResource } from '@wbs/core/models';
import { ActionIconListComponent } from '@wbs/main/components/action-icon-list.component';
import { SortArrowComponent } from '@wbs/main/components/sort-arrow.component';
import { SortableDirective } from '@wbs/main/directives/table-sorter.directive';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { DateTextPipe } from '@wbs/main/pipes/date-text.pipe';
import { TableProcessPipe } from '@wbs/main/pipes/table-process.pipe';
import { TableHelper } from '@wbs/main/services';
import { TrackById } from 'ngxtension/trackby-id-prop';
import { ResourceTypeTextComponent } from '../record-resources-type-text/resource-type-text.component';
import { ResourceViewLinkComponent } from '../resource-view-link/resource-view-link.component';

@Component({
  standalone: true,
  selector: 'wbs-record-resource-list',
  templateUrl: './record-resource-list.component.html',
  styleUrls: ['./record-resource-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [TableHelper],
  imports: [
    ActionIconListComponent,
    CheckPipe,
    DateTextPipe,
    DragAndDropModule,
    FontAwesomeModule,
    ListViewModule,
    ResourceTypeTextComponent,
    ResourceViewLinkComponent,
    SortableDirective,
    SortArrowComponent,
    TableProcessPipe,
    TrackById,
    TranslateModule,
  ],
})
export class RecordResourceListComponent {
  @Input({ required: true }) owner!: string;
  @Input({ required: true }) claims!: string[];
  @Input({ required: true }) list!: RecordResource[];
  @Output() readonly save = new EventEmitter<RecordResource>();

  @ViewChild(ListViewComponent) listview!: ListViewComponent;
  @ViewChild('wrapper', { read: DragTargetContainerDirective })
  dragTargetContainer: any;
  @ViewChild('wrapper', { read: DropTargetContainerDirective })
  dropTargetContainer: any;

  readonly editClaim = PROJECT_CLAIMS.RESOURCES.UPDATE;
  readonly deleteClaim = PROJECT_CLAIMS.RESOURCES.DELETE;

  readonly state = signal(<State>{
    sort: [{ field: 'order', dir: 'asc' }],
  });
  readonly faBars = faBars;
  readonly faGear = faGear;
  readonly menu = [];

  public dragData = ({ dragTarget }: any): any => {
    if (dragTarget instanceof HTMLDivElement) {
      return {
        fromElement: this.setElement(
          dragTarget,
          '.k-listview',
          'data-kendo-listview-index'
        ),
        fromIndex: +dragTarget.getAttribute('data-kendo-listview-item-index')!,
      };
    } else if (dragTarget instanceof HTMLTableRowElement) {
      return {
        fromElement: this.setElement(
          dragTarget,
          '.k-grid',
          'data-kendo-grid-index'
        ),
        fromIndex: +dragTarget.getAttribute('data-kendo-grid-item-index')!,
      };
    }
  };

  public onDrop(e: DropTargetEvent): void {
    const { fromElement, fromIndex } = e.dragData;

    let toElement;
    let destinationIndex = 0;

    toElement = this.setElement(
      e.dropTarget,
      '.k-listview',
      'data-kendo-listview-item-index'
    );
    destinationIndex = calculateDestinationIndex(
      e,
      fromElement,
      fromIndex,
      toElement
    );

    console.log('fromElement', fromElement);
    console.log('fromIndex', fromIndex);
    console.log('destinationIndex', destinationIndex);

    /*this.updateData(
      this.listview.data as Product[],
      this.listview.data as Product[],
      fromIndex,
      destinationIndex,
      this.inStockData,
      this.discontinuedData
    );

    this.discontinuedData = [...this.discontinuedData];
    this.inStockData = [...this.inStockData];*/

    const item = this.list[fromIndex];
    this.list.splice(fromIndex, 1);
    this.list.splice(destinationIndex, 0, item);
    this.list.forEach((x, i) => (x.order = i + 1));

    this.dragTargetContainer.notify();
    this.dropTargetContainer.notify();
  }

  public setElement(target: any, selector: any, attribute: any) {
    return +target.closest(selector).getAttribute(attribute);
  }

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

export const calculateDestinationIndex = (
  e: DropTargetEvent,
  fromElement: number,
  fromIndex: number,
  toElement: number
): number => {
  let toIndex = +e.dropTarget.getAttribute('data-kendo-listview-item-index')!;

  const isInLowerHalf = isDroppedInLowerHalf(e);

  if (fromElement !== toElement) {
    if (isInLowerHalf) {
      toIndex += 1;
    }
  } else {
    if (isInLowerHalf && fromIndex > toIndex) {
      toIndex += 1;
    } else if (!isInLowerHalf && fromIndex < toIndex) {
      toIndex -= 1;
    }
  }
  return toIndex;
};

const isDroppedInLowerHalf = (ev: DropTargetEvent) => {
  const itemCoords = ev.dropTarget.getBoundingClientRect();
  return ev.dragEvent.clientY > itemCoords.top + itemCoords.height / 2;
};
