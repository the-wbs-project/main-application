import { Injectable } from '@angular/core';
import { ContextMenuItem } from '../models';
import { Utils } from './utils.service';

@Injectable({ providedIn: 'root' })
export class MenuService {
  filterList<T extends ContextMenuItem>(
    menuItems: T[],
    claims: string[],
    status: string,
    item: Record<string, any>
  ): T[] {
    if (!menuItems || menuItems.length === 0) return menuItems;

    return menuItems.filter((x) => this.filterItem(x, claims, status, item));
  }

  private filterItem(
    menuItem: ContextMenuItem,
    claims: string[],
    status: string,
    item: Record<string, any>
  ): boolean {
    if (menuItem.filters) {
      if (menuItem.filters.claim && !claims.includes(menuItem.filters.claim))
        return false;

      if (menuItem.filters.stati) {
        const statusResult = menuItem.filters.stati.some((s) => s === status);

        if (!statusResult) return false;
      }
      if (menuItem.filters.props) {
        for (const test of menuItem.filters.props) {
          const propResult = Utils.executeTestByObject(item, test);

          if (!propResult) return false;
        }
      }
    }
    if (menuItem.items) {
      menuItem.items = this.filterList(menuItem.items, claims, status, item);
    }

    return true;
  }
}
