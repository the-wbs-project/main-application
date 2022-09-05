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
  Store,
} from '@ngxs/store';
import { switchMap } from 'rxjs';
import {
  ORG_SETTINGS_MENU_ITEMS,
  PROJECT_MENU_ITEMS,
} from 'src/environments/menu-items.const';
import {
  MainContentSizeChanged,
  ParseNavigation,
  SetProject,
  TurnOffIsLoading,
  UpdateProjectMenu,
} from '../actions';
import { MenuItem, PROJECT_STATI, PROJECT_STATI_TYPE } from '../models';
import { Resources } from '../services';
import { ProjectListState } from './project-list.state';

interface StateModel {
  path?: string;
  projectId?: string;
  isLoading: boolean;
  mainContentWidth: number;
  menuItems: MenuItem[];
  menuType?: 'projects' | 'settings';
  projectItems: MenuItem[];
}

@Injectable()
@UntilDestroy()
@State<StateModel>({
  name: 'ui',
  defaults: {
    isLoading: true,
    mainContentWidth: 0,
    menuItems: [],
    projectItems: PROJECT_MENU_ITEMS,
  },
})
export class UiState implements NgxsOnInit {
  constructor(
    private readonly actions$: Actions,
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  @Selector()
  static isLoading(state: StateModel): boolean {
    return state.isLoading;
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
  static menuItems(state: StateModel): MenuItem[] {
    return state.menuItems;
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
      .pipe(ofActionSuccessful(RouterDataResolved), untilDestroyed(this))
      .subscribe((action: RouterDataResolved) =>
        ctx.dispatch(new ParseNavigation(action.routerState.url))
      );
    this.store
      .select(ProjectListState.list)
      .pipe(
        switchMap((list) => ctx.dispatch(new UpdateProjectMenu(list))),
        untilDestroyed(this)
      )
      .subscribe();
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

  @Action(TurnOffIsLoading)
  TurnOffIsLoading(ctx: StateContext<StateModel>): void {
    ctx.patchState({
      isLoading: false,
    });
  }

  @Action(ParseNavigation)
  parseNavigation(
    ctx: StateContext<StateModel>,
    action: ParseNavigation
  ): void {
    const state = ctx.getState();
    const menuType = action.url?.split('/')[1];

    if (menuType === 'projects') {
      ctx.patchState({
        path: action.url,
        menuItems: state.projectItems,
        menuType,
      });
    } else if (menuType === 'settings') {
      ctx.patchState({
        path: action.url,
        menuItems: ORG_SETTINGS_MENU_ITEMS,
        menuType,
      });
    } else {
      ctx.patchState({
        path: action.url,
        menuItems: [],
        menuType: undefined,
      });
    }
  }

  @Action(UpdateProjectMenu)
  updateProjectMenu(
    ctx: StateContext<StateModel>,
    action: UpdateProjectMenu
  ): void {
    const state = ctx.getState();
    const projectItems = state.projectItems!;
    const parent = projectItems[1];
    const stati = [
      PROJECT_STATI.PLANNING,
      PROJECT_STATI.EXECUTION,
      PROJECT_STATI.FOLLOW_UP,
      PROJECT_STATI.CLOSED,
    ];
    parent.children = [];

    for (const status of stati) {
      const list = action.projects
        .filter((x) => x.status === status)
        .sort((a, b) => (a.title > b.title ? 1 : -1));

      const current: MenuItem = {
        title: `${this.getTitle(status)} (${list.length})`,
        titleNotResource: true,
        type: 'sub',
        children: [],
      };

      for (const project of list) {
        const active = project.id === state.projectId;

        current.children!.push({
          id: project.id,
          path: ['/projects', project.id, 'view'],
          titleNotResource: true,
          title: project.title,
          type: 'link',
          active,
        });
        if (active) current.active = true;
      }
      parent.children.push(current);
    }
    ctx.patchState({ projectItems });

    if (state.menuType === 'projects') {
      ctx.patchState({ menuItems: projectItems });
    }
  }

  @Action(SetProject)
  SetProject(ctx: StateContext<StateModel>, action: SetProject) {
    const state = ctx.getState();
    const projectItems = [...state.projectItems];
    const mainItem = projectItems[1];

    mainItem.active = true;

    for (const section of mainItem.children!) {
      const child = section.children?.find((x) => x.id === action.id);

      section.active = child != null;

      if (child) {
        child.active = true;
      }
    }
    ctx.patchState({ projectItems, projectId: action.id });

    if (state.menuType === 'projects') {
      ctx.patchState({ menuItems: projectItems });
    }
  }

  private getTitle(status: PROJECT_STATI_TYPE): string {
    return this.resources.get(
      status === PROJECT_STATI.CLOSED
        ? 'General.Closed'
        : status === PROJECT_STATI.EXECUTION
        ? 'General.Execution'
        : status === PROJECT_STATI.FOLLOW_UP
        ? 'General.FollowUp'
        : status === PROJECT_STATI.PLANNING
        ? 'General.Planning'
        : ''
    );
  }
}
