import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RouterDataResolved } from '@ngxs/router-plugin';
import {
  Action,
  Actions,
  NgxsOnInit,
  ofActionSuccessful,
  Selector,
  State,
  StateContext,
} from '@ngxs/store';
import { HeaderInformation } from '@wbs/core/models';
import {
  MainContentSizeChanged,
  ParseNavigation,
  SetHeaderInfo,
  ToggleSidebar,
} from '../actions';

interface StateModel {
  header?: HeaderInformation;
  path?: string;
  isLoading: boolean;
  isSidebarExpanded: boolean;
  mainContentWidth: number;
}

declare type Context = StateContext<StateModel>;

@UntilDestroy()
@Injectable()
@State<StateModel>({
  name: 'ui',
  defaults: {
    isLoading: true,
    isSidebarExpanded: true,
    mainContentWidth: 0,
  },
})
export class UiState implements NgxsOnInit {
  constructor(private readonly actions$: Actions) {}

  @Selector()
  static header(state: StateModel): HeaderInformation | undefined {
    return state.header;
  }

  @Selector()
  static mainContentWidth(state: StateModel): number {
    return state.mainContentWidth;
  }

  @Selector()
  static path(state: StateModel): string | undefined {
    return state.path;
  }

  @Selector()
  static isLoading(state: StateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static isSidebarExpanded(state: StateModel): boolean {
    return state.isSidebarExpanded;
  }

  @Selector()
  static size(state: StateModel): 'xs' | 'sm' | 'md' | 'lg' | 'xl' {
    if (state.mainContentWidth < 576) return 'xs';
    if (state.mainContentWidth < 768) return 'sm';
    if (state.mainContentWidth < 992) return 'md';
    if (state.mainContentWidth < 1200) return 'lg';

    return 'xl';
  }

  ngxsOnInit(ctx: Context) {
    this.actions$
      .pipe(ofActionSuccessful(RouterDataResolved<any>), untilDestroyed(this))
      .subscribe((action: RouterDataResolved) =>
        ctx.dispatch(new ParseNavigation(action.routerState.url))
      );
  }

  @Action(MainContentSizeChanged)
  mainContentSizeChanged(ctx: Context, action: MainContentSizeChanged): void {
    ctx.patchState(action);
  }

  @Action(ParseNavigation)
  parseNavigation(ctx: Context, action: ParseNavigation): void {
    ctx.patchState(action);
  }

  @Action(SetHeaderInfo)
  setHeaderInfo(ctx: Context, action: SetHeaderInfo): void {
    ctx.patchState(action);
  }

  @Action(ToggleSidebar)
  toggleSidebar(ctx: Context): void {
    ctx.patchState({ isSidebarExpanded: !ctx.getState().isSidebarExpanded });
  }
}
