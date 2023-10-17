import { Injectable } from '@angular/core';
import { DropPosition } from '@progress/kendo-angular-treelist';
import { WbsNodeView } from '@wbs/core/view-models';
import { WbsNodeService } from '@wbs/main/services';
import { RebuildResults } from '../models';

@Injectable()
export class WbsPhaseService {
  reorder(
    list: WbsNodeView[],
    dragged: WbsNodeView,
    target: WbsNodeView,
    position: DropPosition
  ): RebuildResults {
    dragged.phaseId = target.phaseId;

    if (position === 'over') {
      //
      //  Set the parent to the target and give this item the last position
      //
      dragged.parentId = target.id;
      dragged.order = target.children + 1;
    } else {
      const delta = position === 'before' ? -0.1 : 0.1;

      dragged.parentId = target.parentId;
      dragged.order = target.order + delta;
    }

    const index = list.findIndex((x) => x.id === dragged.id);

    list.splice(index, 1, dragged);

    return this.rebuildLevels(list);
  }

  rebuildLevels(list: WbsNodeView[]): RebuildResults {
    const results: RebuildResults = {
      rows: [],
      changedIds: [],
    };

    const rebuild = (parentId: string, parentLevel: number[]): number => {
      const children = this.getSortedVmChildren(parentId, list);
      let count = 0;

      for (var i = 0; i < children.length; i++) {
        let changed = false;
        const child = children[i];

        if (child.order !== i + 1) {
          child.order = i + 1;
          changed = true;
        }
        const level = [...parentLevel, child.order];
        const levelText = level.join('.');

        if (child.levelText !== levelText) {
          child.levels = level;
          child.levelText = levelText;
          child.depth = levelText.split('.').length;
          changed = true;
        }
        results.rows.push(child);
        const childrenCount = rebuild(child.id, level);

        if (child.children !== childrenCount) {
          child.children = childrenCount;
          changed = true;
        }
        if (child.treeParentId !== parentId) {
          child.treeParentId = parentId;
          changed = true;
        }

        count += child.children + 1;

        if (changed) {
          results.changedIds.push(child.id);
        }
      }
      return count;
    };
    const categories = list.filter((x) => x.parentId == null);

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const parentLevel = [i + 1];

      results.rows.push(list.find((x) => x.id === cat.id)!);

      rebuild(cat.id, parentLevel);
    }
    return results;
  }

  private getSortedVmChildren(
    parentId: string,
    list: WbsNodeView[]
  ): WbsNodeView[] {
    return list
      .filter((x) => x.parentId === parentId)
      .sort(WbsNodeService.sort);
  }
}
