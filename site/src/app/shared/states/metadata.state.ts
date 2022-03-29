import { Injectable } from '@angular/core';
import { Category, PROJECT_VIEW, PROJECT_VIEW_TYPE } from '@wbs/models';
import { StartupService } from '@wbs/services';
import { NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { environment } from 'src/environments/environment';

interface StateModel {
  categoryList: Map<PROJECT_VIEW_TYPE, Category[]>;
  categoryMap: Map<PROJECT_VIEW_TYPE, Map<string, Category>>;
}

@Injectable()
@State<StateModel>({
  name: 'metadata',
  defaults: {
    categoryList: new Map<PROJECT_VIEW_TYPE, Category[]>(),
    categoryMap: new Map<PROJECT_VIEW_TYPE, Map<string, Category>>(),
  },
})
export class MetadataState implements NgxsOnInit {
  constructor(private readonly loader: StartupService) {}

  @Selector()
  static categoryList(state: StateModel): Map<PROJECT_VIEW_TYPE, Category[]> {
    return state.categoryList;
  }

  @Selector()
  static categoryMap(
    state: StateModel
  ): Map<PROJECT_VIEW_TYPE, Map<string, Category>> {
    return state.categoryMap;
  }

  ngxsOnInit(ctx: StateContext<StateModel>) {
    const state = ctx.getState();
    const categoryList = state.categoryList;
    const categoryMap = state.categoryMap;

    categoryList.set(
      PROJECT_VIEW.DISCIPLINE,
      this.loader.categoriesDiscipline ?? []
    );
    categoryList.set(PROJECT_VIEW.PHASE, this.loader.categoriesPhase ?? []);

    categoryMap.set(
      PROJECT_VIEW.DISCIPLINE,
      this.createMap(this.loader.categoriesDiscipline ?? [])
    );
    categoryMap.set(
      PROJECT_VIEW.PHASE,
      this.createMap(this.loader.categoriesPhase ?? [])
    );
    ctx.patchState({
      categoryList,
      categoryMap,
    });
  }

  private createMap(list: Category[]): Map<string, Category> {
    var map = new Map<string, Category>();

    for (const x of list) map.set(x.id, x);

    return map;
  }
}
