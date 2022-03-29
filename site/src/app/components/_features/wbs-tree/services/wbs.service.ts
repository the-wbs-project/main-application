import { Injectable } from '@angular/core';
import { WbsPhaseNode } from '@wbs/models';

@Injectable({ providedIn: 'root' })
export class WbsService {
  rebuildLevels(list: WbsPhaseNode[]): WbsPhaseNode[] {
    const results: WbsPhaseNode[] = [];

    const rebuild = (parentId: string, parentLevel: number[]): number => {
      const children = this.getSortedVmChildren(parentId, list);
      let count = 0;

      for (var i = 0; i < children.length; i++) {
        const child = children[i];

        child.order = i + 1;
        const level = [...parentLevel, child.order];

        child.levels = level;
        child.levelText = level.join('.');

        results.push(child);

        child.children = rebuild(child.id, level);

        count += child.children + 1;
      }
      return count;
    };
    const categories = list.filter((x) => x.parentId == null);

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const parentLevel = [i + 1];

      results.push(list.find((x) => x.id === cat.id)!);

      rebuild(cat.id, parentLevel);
    }
    return results;
  }

  private getSortedVmChildren(
    parentId: string,
    list: WbsPhaseNode[]
  ): WbsPhaseNode[] {
    return list
      .filter((x) => x.parentId === parentId)
      .sort((a, b) => (a.order < b.order ? -1 : 1));
  }
}
