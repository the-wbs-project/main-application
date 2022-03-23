import { WbsNodePhaseViewModel } from '@app/view-models';

export const tableRow = (node: HTMLElement) =>
  node.tagName.toLowerCase() === 'tr';

export const isSameRow = (
  draggedItem: WbsNodePhaseViewModel,
  targetedItem: WbsNodePhaseViewModel
) => {
  return draggedItem.id === targetedItem.id;
};

export const closest = (node: Node | null, predicate: any) => {
  while (node && !predicate(node)) {
    node = node.parentNode;
  }
  return node;
};

export const match = (element: any, selector: string): boolean => {
  const matcher =
    element.matches ||
    element.msMatchesSelector ||
    element.webkitMatchesSelector;

  if (!matcher) {
    return false;
  }

  return matcher.call(element, selector);
};

export const closestWithMatch = (
  element: any,
  selector: string
): HTMLElement | null => {
  if (!document.documentElement.contains(element)) {
    return null;
  }

  let parent = element;

  while (parent !== null && parent.nodeType === 1) {
    if (match(parent, selector)) {
      return parent;
    }

    parent = parent.parentElement || parent.parentNode;
  }

  return null;
};

export const isPresent: Function = (value: any): boolean =>
  value !== null && value !== undefined;

export const getContentElement = (parent: HTMLElement): HTMLElement | null => {
  if (!isPresent(parent)) {
    return null;
  }

  const selector = '.k-grid-table-wrap tbody tr';
  if (match(parent, selector)) {
    return parent;
  }

  return parent.querySelector(selector);
};

export const findDataItem = (
  data: WbsNodePhaseViewModel[],
  row: HTMLTableRowElement
) => {
  const level = row.cells[0].textContent!.trim();
  return data.find((item) => item.levelText === level);
};

export const focusRow = (row: HTMLTableRowElement) => {
  row.setAttribute('style', 'background-color: #c2bebe');
};

export const showDropHint = (
  row: HTMLTableRowElement,
  position: 'before' | 'after'
) => {
  let rowTds = row.querySelectorAll('td');
  if (position === 'before') {
    rowTds.forEach((td) => {
      td.setAttribute('style', 'border-top: solid 2px #0275d8');
    });
  }

  if (position === 'after') {
    rowTds.forEach((td) => {
      td.setAttribute('style', 'border-bottom: solid 2px #ff6358');
    });
  }
};

export const removeDropHint = (row: HTMLTableRowElement) => {
  row.removeAttribute('style');
  const tds = row.querySelectorAll('td');
  tds.forEach((td) => {
    td.removeAttribute('style');
  });
};
