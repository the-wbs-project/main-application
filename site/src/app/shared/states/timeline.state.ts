import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ActionDefinition, Activity, LISTS } from '@wbs/shared/models';
import { DataServiceFactory } from '@wbs/shared/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LoadTimeline,
  LoadTimelineDefinitions,
  SaveTimelineAction,
} from '../actions';

interface StateModel {
  definitions?: ActionDefinition[];
  timeline: Activity[];
  toplevelId?: string;
}

@Injectable()
@State<StateModel>({
  name: 'timeline',
  defaults: {
    timeline: [],
  },
})
export class TimelineState {
  constructor(private readonly data: DataServiceFactory) {}

  @Selector()
  static definitions(state: StateModel): ActionDefinition[] | undefined {
    return state.definitions;
  }

  @Selector()
  static timeline(state: StateModel): Activity[] {
    return state.timeline;
  }

  @Action(LoadTimelineDefinitions)
  setupActions(ctx: StateContext<StateModel>): Observable<void> {
    return this.data.metdata.getListAsync<ActionDefinition>(LISTS.ACTIONS).pipe(
      map((definitions) => {
        ctx.patchState({
          definitions,
        });
      })
    );
  }

  @Action(LoadTimeline)
  loadTimeline(
    ctx: StateContext<StateModel>,
    action: LoadTimeline
  ): Observable<void> | void {
    if (ctx.getState().toplevelId === action.topLevelId) return;

    return this.data.activities.getAsync(action.topLevelId).pipe(
      map((timeline) => {
        ctx.patchState({
          timeline: timeline.sort(sort),
          toplevelId: action.topLevelId,
        });
      })
    );
  }

  @Action(SaveTimelineAction)
  saveTimelineAction(
    ctx: StateContext<StateModel>,
    action: SaveTimelineAction
  ): Observable<void> {
    const state = ctx.getState();
    const topLevelId = state.toplevelId!;

    return this.data.activities
      .putAsync(topLevelId, action.data, action.dataType)
      .pipe(
        map((activity) => {
          state.timeline.push(activity);

          ctx.patchState({
            timeline: state.timeline.sort(sort),
          });
        })
      );
  }
}

function sort(a: Activity, b: Activity): number {
  return b.timestamp - a.timestamp;
}
