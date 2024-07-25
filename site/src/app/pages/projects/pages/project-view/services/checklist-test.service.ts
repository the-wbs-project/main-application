import { Injectable } from '@angular/core';
import { Utils } from '@wbs/core/services';
import { apply } from 'jspath';
import {
  CHECKLIST_RESULTS,
  ChecklistDataModel,
  ChecklistExistsTest,
  ChecklistGroup,
  ChecklistGroupResults,
  ChecklistItemResults,
  ChecklistValueTest,
} from '../models';

@Injectable()
export class ChecklistTestService {
  performChecks(
    data: ChecklistDataModel,
    tests: ChecklistGroup[]
  ): ChecklistGroupResults[] {
    //
    //  Perform checks
    //
    const results: ChecklistGroupResults[] = [];

    for (const group of tests ?? []) {
      const items: ChecklistItemResults[] = [];

      for (const test of group.items) {
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
    return results;
  }

  private performExists(
    data: ChecklistDataModel,
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
    data: ChecklistDataModel,
    test: ChecklistValueTest
  ): ChecklistItemResults {
    let arrayResults = apply(test.path, data);
    let results: number =
      test.type === 'array' ? arrayResults.length : arrayResults[0];

    let passes = Utils.executeTestByValue(
      results,
      test.pass.op,
      test.pass.value
    );

    if (passes)
      return {
        description: test.description,
        result: CHECKLIST_RESULTS.PASS,
      };

    if (test.warn) {
      passes = Utils.executeTestByValue(results, test.warn.op, test.warn.value);

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
}
