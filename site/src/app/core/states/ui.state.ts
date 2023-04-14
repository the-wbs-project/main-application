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
import { MainContentSizeChanged, ParseNavigation } from '../actions';

interface StateModel {
  path?: string;
  isLoading: boolean;
  mainContentWidth: number;
}

@Injectable()
@UntilDestroy()
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
      .pipe(ofActionSuccessful(RouterDataResolved<any>), untilDestroyed(this))
      .subscribe((action: RouterDataResolved) =>
        ctx.dispatch(new ParseNavigation(action.routerState.url))
      );
  }

  @Action(MainContentSizeChanged)
  mainContentSizeChanged(
    ctx: StateContext<StateModel>,
    action: MainContentSizeChanged
  ): void {
    ctx.patchState({
      mainContentWidth: action.width,
    });
  }

  @Action(ParseNavigation)
  parseNavigation(
    ctx: StateContext<StateModel>,
    action: ParseNavigation
  ): void {
    ctx.patchState({
      path: action.url,
    });
  }
}
