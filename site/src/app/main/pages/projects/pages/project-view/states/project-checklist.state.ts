import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Project } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { apply } from 'jspath';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InitiateChecklist, PerformChecklist } from '../actions';
import {
  CHECKLIST_OPERATORS,
  CHECKLIST_RESULTS,
  ChecklistExistsTest,
  ChecklistGroup,
  ChecklistGroupResults,
  ChecklistItemResults,
  ChecklistValueTest,
} from '../models';
import { ChecklistDataService } from '../services';

interface DataModel {
  project?: Project;
  disciplines?: WbsNodeView[];
  phases?: WbsNodeView[];
}

interface StateModel {
  data: DataModel;
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
  constructor(private readonly data: ChecklistDataService) {}

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

    return this.data.getAsync().pipe(map((tests) => ctx.patchState({ tests })));
  }

  @Action(PerformChecklist)
  performChecklist(
    ctx: StateContext<StateModel>,
    action: PerformChecklist
  ): void {
    const state = ctx.getState();
    const data = state.data;

    data.project = action.project ?? data.project;
    data.disciplines = action.disciplines ?? data.disciplines;
    data.phases = action.phases ?? data.phases;

    ctx.patchState({ data });

    if (!state.tests) return;
    //
    //  Perform checks
    //
    const results: ChecklistGroupResults[] = [];

    for (const group of state.tests ?? []) {
      const items: ChecklistItemResults[] = [];

      for (const test of group.tests) {
        if (test.type === 'exists') {
          items.push(this.performExists(data, test));
        } else {
          items.push(this.performValue(data, test));
        }
      }

      results.push({
        description: group.description,
        items,
        result: items.some((x) => x.result === CHECKLIST_RESULTS.FAIL)
          ? CHECKLIST_RESULTS.FAIL
          : items.some((x) => x.result === CHECKLIST_RESULTS.WARN)
          ? CHECKLIST_RESULTS.WARN
          : CHECKLIST_RESULTS.PASS,
      });
    }

    ctx.patchState({
      results,
      canSubmitForApproval: !results.some(
        (x) => x.result === CHECKLIST_RESULTS.FAIL
      ),
    });
  }

  private performExists(
    data: DataModel,
    test: ChecklistExistsTest
  ): ChecklistItemResults {
    const results = apply(test.path, data)[0];
    const passes = results != null;
    return {
      description: test.description,
      result: passes ? CHECKLIST_RESULTS.PASS : CHECKLIST_RESULTS.FAIL,
      message: passes ? undefined : test.failMessage,
    };
  }

  private performValue(
    data: DataModel,
    test: ChecklistValueTest
  ): ChecklistItemResults {
    let arrayResults = apply(test.path, data);
    let results: number =
      test.type === 'array' ? arrayResults.length : arrayResults[0];

    let passes = this.perform(results, test.pass.op, test.pass.value);

    if (passes)
      return {
        description: test.description,
        result: CHECKLIST_RESULTS.PASS,
      };

    if (test.warn) {
      passes = this.perform(results, test.warn.op, test.warn.value);

      if (passes)
        return {
          description: test.description,
          result: CHECKLIST_RESULTS.WARN,
          message: test.warnMessage,
        };
    }

    return {
      description: test.description,
      result: CHECKLIST_RESULTS.FAIL,
      message: test.failMessage,
    };
  }

  private perform(
    val1: number,
    op: CHECKLIST_OPERATORS,
    val2: number
  ): boolean {
    switch (op) {
      case '=':
        return val1 == val2;
      case '!=':
        return val1 != val2;
      case '>':
        return val1 > val2;
      case '>=':
        return val1 >= val2;
      case '<':
        return val1 < val2;
      case '<=':
        return val1 <= val2;
    }
    return false;
  }
}
