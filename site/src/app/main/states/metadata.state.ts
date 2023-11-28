import { Injectable } from '@angular/core';
import { NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ListItem, LISTS } from '@wbs/core/models';
import { forkJoin, map } from 'rxjs';

interface StateModel {
  categoryIcons: Map<string, Map<string, string>>;
  categoryList: Map<string, ListItem[]>;
  categoryMap: Map<string, Map<string, ListItem>>;
  categoryNames: Map<string, Map<string, string>>;
  projectCategories: ListItem[];
}

@Injectable()
@State<StateModel>({
  name: 'metadata',
  defaults: {
    categoryIcons: new Map<string, Map<string, string>>(),
    categoryList: new Map<string, ListItem[]>(),
    categoryMap: new Map<string, Map<string, ListItem>>(),
    categoryNames: new Map<string, Map<string, string>>(),
    projectCategories: [],
  },
})
export class MetadataState implements NgxsOnInit {
  constructor(private readonly data: DataServiceFactory) {}

  @Selector()
  static categoryIcons(state: StateModel): Map<string, Map<string, string>> {
    return state.categoryIcons;
  }

  @Selector()
  static categoryList(state: StateModel): Map<string, ListItem[]> {
    return state.categoryList;
  }

  @Selector()
  static categoryNames(state: StateModel): Map<string, Map<string, string>> {
    return state.categoryNames;
  }

  @Selector()
  static disciplines(state: StateModel): ListItem[] {
    return state.categoryList.get(LISTS.DISCIPLINE)!;
  }

  @Selector()
  static phases(state: StateModel): ListItem[] {
    return state.categoryList.get(LISTS.PHASE)!;
  }

  @Selector()
  static projectCategories(state: StateModel): ListItem[] {
    return state.categoryList.get(LISTS.PROJECT_CATEGORIES)!;
  }

  ngxsOnInit(ctx: StateContext<any>): void {
    forkJoin([
      this.data.metdata.getListAsync<ListItem>(LISTS.PROJECT_CATEGORIES),
      this.data.metdata.getListAsync<ListItem>(LISTS.DISCIPLINE),
      this.data.metdata.getListAsync<ListItem>(LISTS.PHASE),
    ])
      .pipe(
        map(([projectCats, discipline, phase]) => {
          const state = ctx.getState();
          const categoryList = state.categoryList;
          const categoryMap = state.categoryMap;
          const categoryIcons = new Map<string, Map<string, string>>();
          const categoryNames = new Map<string, Map<string, string>>();

          discipline = discipline.sort((a, b) => a.order - b.order);
          phase = phase.sort((a, b) => a.order - b.order);
          projectCats = projectCats.sort((a, b) => a.order - b.order);

          categoryIcons.set(LISTS.DISCIPLINE, new Map<string, string>());
          categoryIcons.set(LISTS.PHASE, new Map<string, string>());
          categoryIcons.set(
            LISTS.PROJECT_CATEGORIES,
            new Map<string, string>()
          );

          categoryNames.set(LISTS.DISCIPLINE, new Map<string, string>());
          categoryNames.set(LISTS.PHASE, new Map<string, string>());
          categoryNames.set(
            LISTS.PROJECT_CATEGORIES,
            new Map<string, string>()
          );

          categoryList.set(LISTS.DISCIPLINE, discipline);
          categoryList.set(LISTS.PHASE, phase);
          categoryList.set(LISTS.PROJECT_CATEGORIES, projectCats);

          categoryMap.set(LISTS.DISCIPLINE, this.createMap(discipline));
          categoryMap.set(LISTS.PHASE, this.createMap(phase));
          categoryMap.set(
            LISTS.PROJECT_CATEGORIES,
            this.createMap(projectCats)
          );

          for (const cat of [...projectCats, ...discipline, ...phase]) {
            categoryNames.get(cat.type)!.set(cat.id, cat.label);

            if (cat.icon) categoryIcons.get(cat.type)!.set(cat.id, cat.icon);
          }

          ctx.patchState({
            categoryIcons,
            categoryList,
            categoryMap,
            categoryNames,
          });
        })
      )
      .subscribe();
  }

  private createMap(list: ListItem[]): Map<string, ListItem> {
    var map = new Map<string, ListItem>();

    for (const x of list) map.set(x.id, x);

    return map;
  }
}
