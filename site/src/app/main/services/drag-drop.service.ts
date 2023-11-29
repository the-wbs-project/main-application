import { Injectable } from '@angular/core';
import { DropTargetEvent } from '@progress/kendo-angular-utils';

@Injectable()
export class DragDropService {
  dragData = ({ dragTarget }: any): any => {
    return {
      fromElement: this.setElement(
        dragTarget,
        '.k-listview',
        'data-kendo-listview-index'
      ),
      fromIndex: +dragTarget.getAttribute('data-kendo-listview-item-index')!,
    };
  };

  onDrop<T>(e: DropTargetEvent, list: T[]): void {
    const { fromElement, fromIndex } = e.dragData;

    let toElement;
    let destinationIndex = 0;

    toElement = this.setElement(
      e.dropTarget,
      '.k-listview',
      'data-kendo-listview-item-index'
    );
    destinationIndex = this.calculateDestinationIndex(
      e,
      fromElement,
      fromIndex,
      toElement
    );

    const item = list[fromIndex];

    list.splice(fromIndex, 1);
    list.splice(destinationIndex, 0, item);
  }

  setElement(target: any, selector: any, attribute: any) {
    return +target.closest(selector).getAttribute(attribute);
  }

  calculateDestinationIndex(
    e: DropTargetEvent,
    fromElement: number,
    fromIndex: number,
    toElement: number
  ): number {
    let toIndex = +e.dropTarget.getAttribute('data-kendo-listview-item-index')!;

    const isInLowerHalf = this.isDroppedInLowerHalf(e);

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
  }

  isDroppedInLowerHalf(ev: DropTargetEvent): boolean {
    const itemCoords = ev.dropTarget.getBoundingClientRect();
    return ev.dragEvent.clientY > itemCoords.top + itemCoords.height / 2;
  }
}
