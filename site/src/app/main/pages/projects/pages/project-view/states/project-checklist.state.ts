import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { InitiateChecklist, PerformChecks, SetChecklistData } from '../actions';
import {
  CHECKLIST_RESULTS,
  ChecklistDataModel,
  ChecklistGroup,
  ChecklistGroupResults,
} from '../models';
import { ChecklistDataService, ChecklistTestService } from '../services';

interface StateModel {
  data: ChecklistDataModel;
  canSubmitForApproval: boolean;
  tests?: ChecklistGroup[];
  results?: ChecklistGroupResults[];
}

@Injectable()
@State<StateModel>({
  name: 'projectChecklist',
  defaults: {
    data: {},
    canSubmitForApproval: false,
  },
})
export class ProjectChecklistState {
  constructor(
    private readonly data: ChecklistDataService,
    private readonly test: ChecklistTestService
  ) {}

  @Selector()
  static canSubmitForApproval(state: StateModel): boolean {
    return state.canSubmitForApproval;
  }

  @Selector()
  static results(state: StateModel): ChecklistGroupResults[] | undefined {
    return state.results;
  }

  @Action(InitiateChecklist)
  initiateChecklist(ctx: StateContext<StateModel>): Observable<any> | void {
    if (ctx.getState().tests) return;

    return this.data.getAsync().pipe(
      map((tests) => ctx.patchState({ tests })),
      tap(() => ctx.dispatch(new PerformChecks()))
    );
  }

  @Action(SetChecklistData)
  performChecklist(
    ctx: StateContext<StateModel>,
    action: SetChecklistData
  ): Observable<void> {
    const state = ctx.getState();
    const data = state.data;

    ctx.patchState({
      data: {
        project: action.project ?? data.project,
        disciplines: action.disciplines ?? data.disciplines,
        phases: action.phases ?? data.phases,
      },
    });

    return ctx.dispatch(new PerformChecks());
  }

  @Action(PerformChecks)
  performChecks(ctx: StateContext<StateModel>): void {
    const state = ctx.getState();

    if (!state.tests || !state.data) return;
    //
    //  Perform checks
    //
    const results = this.test.performChecks(state.data, state.tests);

    ctx.patchState({
      results,
      canSubmitForApproval: !results.some(
        (x) => x.result === CHECKLIST_RESULTS.FAIL
      ),
    });
  }
}
