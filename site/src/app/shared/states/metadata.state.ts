import { Injectable } from '@angular/core';
import {
  ListItem,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
} from '@wbs/shared/models';
import { Resources, StartupService } from '@wbs/shared/services';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetupCategories } from '@wbs/shared/actions';

interface StateModel {
  categoryList: Map<PROJECT_NODE_VIEW_TYPE, ListItem[]>;
  categoryMap: Map<PROJECT_NODE_VIEW_TYPE, Map<string, ListItem>>;
  categoryNames: Map<string, string>;
  disciplineCategories: ListItem[];
  phaseCategories: ListItem[];
}

@Injectable()
@State<StateModel>({
  name: 'metadata',
  defaults: {
    categoryList: new Map<PROJECT_NODE_VIEW_TYPE, ListItem[]>(),
    categoryMap: new Map<PROJECT_NODE_VIEW_TYPE, Map<string, ListItem>>(),
    categoryNames: new Map<string, string>(),
    disciplineCategories: [],
    phaseCategories: [],
  },
})
export class MetadataState {
  constructor(
    private readonly loader: StartupService,
    private readonly resources: Resources
  ) {}

  @Selector()
  static categoryList(
    state: StateModel
  ): Map<PROJECT_NODE_VIEW_TYPE, ListItem[]> {
    return state.categoryList;
  }

  @Selector()
  static categoryMap(
    state: StateModel
  ): Map<PROJECT_NODE_VIEW_TYPE, Map<string, ListItem>> {
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

  @Action(SetupCategories)
  setupCategories(ctx: StateContext<StateModel>) {
    const state = ctx.getState();
    const categoryList = state.categoryList;
    const categoryMap = state.categoryMap;
    const discipline = this.loader.categoriesDiscipline ?? [];
    const phase = this.loader.categoriesPhase ?? [];

    console.log('working on labels');

    for (const cat of [...discipline, ...phase]) {
      cat.label = this.resources.get(cat.label);
    }

    categoryList.set(PROJECT_NODE_VIEW.DISCIPLINE, discipline);
    categoryList.set(PROJECT_NODE_VIEW.PHASE, phase);

    categoryMap.set(PROJECT_NODE_VIEW.DISCIPLINE, this.createMap(discipline));
    categoryMap.set(PROJECT_NODE_VIEW.PHASE, this.createMap(phase));

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
