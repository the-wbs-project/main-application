import { inject, Injectable } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Category, ListItem, LISTS } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable()
export class CategoryState {
  private readonly data = inject(DataServiceFactory);
  private readonly resources = inject(Resources);

  private _icons = new Map<string, Map<string, string>>();
  private _list = new Map<string, ListItem[]>();
  private _map = new Map<string, Map<string, ListItem>>();
  private _names = new Map<string, Map<string, string>>();

  //
  //  ICONS
  //
  get icons(): Map<string, Map<string, string>> {
    return this._icons;
  }

  getIcons(category: string): Map<string, string> {
    return this._icons.get(category)!;
  }

  getIcon(category: string, key: string): string | undefined {
    return this._icons.get(category)?.get(key);
  }

  //
  //  NAMES
  //
  get names(): Map<string, Map<string, string>> {
    return this._names;
  }

  getNames(category: string): Map<string, string> {
    return this._names.get(category)!;
  }

  getName(category: string, key: string): string | undefined {
    return this._names.get(category)?.get(key);
  }

  //
  //  LISTS
  //

  get disciplines(): Category[] {
    return this._list.get(LISTS.DISCIPLINE)!;
  }

  get phases(): Category[] {
    return this._list.get(LISTS.PHASE)!;
  }

  get projectCategories(): Category[] {
    return this._list.get(LISTS.PROJECT_CATEGORIES)!;
  }

  loadAsync(): Observable<void> {
    return forkJoin([
      this.data.metdata.getListAsync<ListItem>(LISTS.PROJECT_CATEGORIES),
      this.data.metdata.getListAsync<ListItem>(LISTS.DISCIPLINE),
      this.data.metdata.getListAsync<ListItem>(LISTS.PHASE),
    ]).pipe(
      map(([projectCats, discipline, phase]) => {
        const categoryMap = new Map<string, Map<string, ListItem>>();
        const categoryList = new Map<string, ListItem[]>();
        const categoryIcons = new Map<string, Map<string, string>>();
        const categoryNames = new Map<string, Map<string, string>>();

        discipline = discipline.sort((a, b) => a.order - b.order);
        phase = phase.sort((a, b) => a.order - b.order);
        projectCats = projectCats.sort((a, b) => a.order - b.order);

        categoryIcons.set(LISTS.DISCIPLINE, new Map<string, string>());
        categoryIcons.set(LISTS.PHASE, new Map<string, string>());
        categoryIcons.set(LISTS.PROJECT_CATEGORIES, new Map<string, string>());

        categoryNames.set(LISTS.DISCIPLINE, new Map<string, string>());
        categoryNames.set(LISTS.PHASE, new Map<string, string>());
        categoryNames.set(LISTS.PROJECT_CATEGORIES, new Map<string, string>());

        categoryList.set(LISTS.DISCIPLINE, discipline);
        categoryList.set(LISTS.PHASE, phase);
        categoryList.set(LISTS.PROJECT_CATEGORIES, projectCats);

        categoryMap.set(LISTS.DISCIPLINE, this.createMap(discipline));
        categoryMap.set(LISTS.PHASE, this.createMap(phase));
        categoryMap.set(LISTS.PROJECT_CATEGORIES, this.createMap(projectCats));

        for (const cat of [...projectCats, ...discipline, ...phase]) {
          categoryNames.get(cat.type)!.set(cat.id, cat.label);

          if (cat.icon) categoryIcons.get(cat.type)!.set(cat.id, cat.icon);
        }

        for (const cat of categoryList.keys()) {
          for (const item of categoryList.get(cat)!) {
            item.label = this.resources.get(item.label);

            if (item.description) {
              item.description = this.resources.get(item.description);
            }
          }
        }

        this._icons = categoryIcons;
        this._list = categoryList;
        this._map = categoryMap;
        this._names = categoryNames;
      })
    );
  }

  private createMap(list: ListItem[]): Map<string, ListItem> {
    var map = new Map<string, ListItem>();

    for (const x of list) map.set(x.id, x);

    return map;
  }
}
