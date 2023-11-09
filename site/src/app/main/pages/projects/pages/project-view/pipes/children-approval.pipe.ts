import { Pipe, PipeTransform } from '@angular/core';
import { ProjectApproval } from '@wbs/core/models';
import { ChildrenApprovalStats } from '../models';

@Pipe({ name: 'childrenApproval', standalone: true })
export class ChildrenApprovalPipe implements PipeTransform {
  transform(
    children: string[],
    map: Map<string, ProjectApproval> | undefined
  ): ChildrenApprovalStats | undefined {
    if (children.length === 0 || map === undefined) return undefined;

    let total = 0;
    let pass = 0;
    let fail = 0;

    for (const id of children) {
      const a = map.get(id);
      if (!a) continue;

      if (a.isApproved === true) pass++;
      else if (a.isApproved === false) fail++;
      total++;
    }

    return {
      totalCount: total,
      passedCount: pass,
      passedPercent: total === 0 ? 0 : (pass / total) * 100,
      failedCount: fail,
      failedPercent: total === 0 ? 0 : (fail / total) * 100,
    };
  }
}
