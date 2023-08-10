import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
} from '../actions';

interface StateModel {
  header?: HeaderInformation;
  path?: string;
  isLoading: boolean;
  mainContentWidth: number;
}

@Injectable()
@State<StateModel>({
  name: 'ui',
  defaults: {
    isLoading: true,
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
  static size(state: StateModel): 'xs' | 'sm' | 'md' | 'lg' | 'xl' {
    if (state.mainContentWidth < 576) return 'xs';
    if (state.mainContentWidth < 768) return 'sm';
    if (state.mainContentWidth < 992) return 'md';
    if (state.mainContentWidth < 1200) return 'lg';

    return 'xl';
  }

  ngxsOnInit(ctx: StateContext<StateModel>) {
    this.actions$
      .pipe(ofActionSuccessful(RouterDataResolved<any>), takeUntilDestroyed())
      .subscribe((action: RouterDataResolved) =>
        ctx.dispatch(new ParseNavigation(action.routerState.url))
      );
  }

  @Action(MainContentSizeChanged)
  mainContentSizeChanged(
    ctx: StateContext<StateModel>,
    action: MainContentSizeChanged
  ): void {
    ctx.patchState(action);
  }

  @Action(ParseNavigation)
  parseNavigation(
    ctx: StateContext<StateModel>,
    action: ParseNavigation
  ): void {
    ctx.patchState(action);
  }

  @Action(SetHeaderInfo)
  setHeaderInfo(ctx: StateContext<StateModel>, action: SetHeaderInfo): void {
    ctx.patchState(action);
  }
}
