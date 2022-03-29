import { Injectable } from '@angular/core';
import { WbsNode } from '@wbs/models';
import { WbsNodePhaseViewModel } from '@wbs/view-models';

@Injectable({ providedIn: 'root' })
export class WbsService {
  rebuildLevels(list: WbsNodePhaseViewModel[]): void {
    const rebuild = (parentId: string, parentLevel: number[]): void => {
      const children = this.getSortedVmChildren(parentId, list);

      for (var i = 0; i < children.length; i++) {
        const child = children[i];

        child.order = i + 1;
        const level = [...parentLevel, child.order];

        child.levels = level;
        child.levelText = level.join('.');

        rebuild(child.id, level);
      }
    };
    const categories = list.filter((x) => x.parentId == null);

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const parentLevel = [i + 1];
      rebuild(cat.id, parentLevel);
    }
  }

  private getSortedChildren(parentId: string, list: WbsNode[]): WbsNode[] {
    return list
      .filter((x) => x.phase.parentId === parentId)
      .sort((a, b) => (a.phase.order < b.phase.order ? -1 : 1));
  }

  private getSortedVmChildren(
    parentId: string,
    list: WbsNodePhaseViewModel[]
  ): WbsNodePhaseViewModel[] {
    return list
      .filter((x) => x.parentId === parentId)
      .sort((a, b) => (a.order < b.order ? -1 : 1));
  }

  private getPhaseChildren(
    parentId: string,
    parentLevel: number[],
    list: WbsNode[]
  ): WbsNodePhaseViewModel[] {
    const results: WbsNodePhaseViewModel[] = [];

    for (const child of this.getSortedChildren(parentId, list)) {
      const childLevel = [...parentLevel, child.phase.order];
      results.push({
        id: child.id,
        parentId: parentId,
        order: child.phase.order,
        levels: childLevel,
        title: child.title,
        levelText: childLevel.join('.'),
      });
      results.push(...this.getPhaseChildren(child.id, childLevel, list));
    }
    return results;
  }

  private updateModels(
    models: WbsNode[],
    list: WbsNodePhaseViewModel[]
  ): WbsNode[] {
    const updated: WbsNode[] = [];

    for (const vm of list) {
      if (vm.parentId == null) continue;

      const newModel = {
        id: vm.id,
        title: vm.title,
        phase: {
          levels: vm.levels,
          order: vm.order,
          parentId: vm.parentId,
        },
      };
      updated.push(newModel);
    }

    return updated;
  }

  /*private rebuildParentLevels(nodes: WbsNodePhaseViewModel[]) {
    //
    //  Now set parent Ids
    //
    for (const node of nodes) {
      if (node.parentLevel == null) continue;

      node.parentId =
        nodes.find((x) => x.level === node.parentLevel)?.id ?? null;
    }
  }*/
}
