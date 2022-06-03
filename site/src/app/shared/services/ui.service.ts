import { Injectable } from '@angular/core';
import {
  ORG_SETTINGS_MENU_ITEMS,
  PROJECT_MENU_ITEMS,
} from 'src/environments/menu-items.const';
import { MenuItem } from '../models';

@Injectable({ providedIn: 'root' })
export class UiService {
  getMenuItemTitle(path: string, exact: boolean): string | undefined {
    const items = [...PROJECT_MENU_ITEMS, ...ORG_SETTINGS_MENU_ITEMS];
    const path2 = path.toLowerCase();

    for (const item of items) {
      const result = this.getTitle(item, path2, exact);

      if (result) return result;
    }
    return undefined;
  }

  private getTitle(
    item: MenuItem,
    path: string,
    exact: boolean
  ): string | undefined {
    if (item.path) {
      if (exact && item.path === path) return item.title;
      if (!exact && path.startsWith(item.path)) return item.title;
    }
    if (item.children) {
      for (const child of item.children) {
        const result = this.getTitle(child, path, exact);

        if (result) return result;
      }
    }
    return undefined;
  }
}
