import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ChangeBreadcrumbs } from '../actions';
import { Breadcrumb } from '../models';

interface StateModel {
  crumbs: Breadcrumb[];
}

@Injectable()
@State<StateModel>({
  name: 'settings',
  defaults: { crumbs: [] },
})
export class SettingsState {
  @Selector()
  static crumbs(state: StateModel): Breadcrumb[] {
    return state.crumbs;
  }

  @Action(ChangeBreadcrumbs)
  changeBreadcrumbs(
    ctx: StateContext<StateModel>,
    action: ChangeBreadcrumbs
  ): void {
    ctx.patchState({
      crumbs: action.crumbs,
    });
  }
}
