import { Injectable } from '@angular/core';
import { WbsNodeView } from '@wbs/models';

@Injectable()
export class WbsPhaseService {
  rebuildLevels(list: WbsNodeView[]): WbsNodeView[] {
    const results: WbsNodeView[] = [];

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
    list: WbsNodeView[]
  ): WbsNodeView[] {
    return list
      .filter((x) => x.parentId === parentId)
      .sort((a, b) => (a.order < b.order ? -1 : 1));
  }
}