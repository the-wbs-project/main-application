import { Injectable } from '@angular/core';
import { ListItem, PROJECT_VIEW, PROJECT_VIEW_TYPE } from '@wbs/models';
import { StartupService } from '@wbs/services';
import { NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';

interface StateModel {
  categoryList: Map<PROJECT_VIEW_TYPE, ListItem[]>;
  categoryMap: Map<PROJECT_VIEW_TYPE, Map<string, ListItem>>;
  categoryNames: Map<string, string>;
  disciplineCategories: ListItem[];
  phaseCategories: ListItem[];
}

@Injectable()
@State<StateModel>({
  name: 'metadata',
  defaults: {
    categoryList: new Map<PROJECT_VIEW_TYPE, ListItem[]>(),
    categoryMap: new Map<PROJECT_VIEW_TYPE, Map<string, ListItem>>(),
    categoryNames: new Map<string, string>(),
    disciplineCategories: [],
    phaseCategories: [],
  },
})
export class MetadataState implements NgxsOnInit {
  constructor(private readonly loader: StartupService) {}

  @Selector()
  static categoryList(state: StateModel): Map<PROJECT_VIEW_TYPE, ListItem[]> {
    return state.categoryList;
  }

  @Selector()
  static categoryMap(
    state: StateModel
  ): Map<PROJECT_VIEW_TYPE, Map<string, ListItem>> {
    return state.categoryMap;
  }

  @Selector()
  static categoryNames(state: StateModel): Map<string, string> {
    return state.categoryNames;
  }

  @Selector()
  static disciplineCategories(state: StateModel): ListItem[] {
    return state.disciplineCategories;
  }

  @Selector()
  static phaseCategories(state: StateModel): ListItem[] {
    return state.phaseCategories;
  }

  ngxsOnInit(ctx: StateContext<StateModel>) {
    const state = ctx.getState();
    const categoryList = state.categoryList;
    const categoryMap = state.categoryMap;
    const discipline = this.loader.categoriesDiscipline ?? [];
    const phase = this.loader.categoriesPhase ?? [];

    categoryList.set(PROJECT_VIEW.DISCIPLINE, discipline);
    categoryList.set(PROJECT_VIEW.PHASE, phase);

    categoryMap.set(PROJECT_VIEW.DISCIPLINE, this.createMap(discipline));
    categoryMap.set(PROJECT_VIEW.PHASE, this.createMap(phase));

    for (const cat of [...discipline, ...phase]) {
      state.categoryNames.set(cat.id, cat.label);
    }
    ctx.patchState({
      categoryList,
      categoryMap,
      categoryNames: state.categoryNames,
      disciplineCategories: discipline,
      phaseCategories: phase,
    });
  }

  private createMap(list: ListItem[]): Map<string, ListItem> {
    var map = new Map<string, ListItem>();

    for (const x of list) map.set(x.id, x);

    return map;
  }
}
