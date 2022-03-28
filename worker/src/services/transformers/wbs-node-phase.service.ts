import { Category, Project, WbsNode, WbsPhaseNode } from '../../models';
import { ResourceService } from '../helpers';

export class WbsNodePhaseTransformer {
  run(
    project: Project,
    categoryList: Category[],
    resources: ResourceService,
  ): WbsPhaseNode[] {
    const nodes: WbsPhaseNode[] = [];
    const categories = <Category[]>(
      project.categories.phase
        .map((x) => categoryList.find((c) => c.id === x))
        .filter((x) => x)
    );

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const parentlevel = [i + 1];
      nodes.push({
        id: cat.id,
        parentId: null,
        levels: [...parentlevel],
        levelText: (i + 1).toString(),
        title: resources.get(cat.label),
        order: i + 1,
      });
      nodes.push(...this.getPhaseChildren(cat.id, parentlevel, project.nodes));
    }
    return nodes;
  }

  private getSortedChildren(parentId: string, list: WbsNode[]): WbsNode[] {
    return list
      .filter((x) => x.phase?.parentId === parentId)
      .sort((a, b) => ((a.phase?.order ?? 0) < (b.phase?.order ?? 0) ? -1 : 1));
  }

  private getPhaseChildren(
    parentId: string,
    parentLevel: number[],
    list: WbsNode[],
  ): WbsPhaseNode[] {
    const results: WbsPhaseNode[] = [];

    for (const child of this.getSortedChildren(parentId, list)) {
      const childLevel = [...parentLevel, child.phase?.order ?? 0];
      results.push({
        id: child.id,
        parentId: parentId,
        order: child.phase?.order ?? 0,
        levels: childLevel,
        title: child.title,
        levelText: childLevel.join('.'),
      });
      results.push(...this.getPhaseChildren(child.id, childLevel, list));
    }
    return results;
  }
}
