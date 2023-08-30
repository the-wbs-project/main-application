import { Store } from '@ngxs/store';
import { ListItem, Project, WbsNode } from '@wbs/core/models';
import { MetadataState } from '@wbs/main/states';
import { WbsNodeView } from '@wbs/core/view-models';
import { Resources } from '../../../resource.service';
import { WbsNodeService } from '../../../wbs-node.service';

export class WbsNodePhaseTransformer {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  private get disciplineList(): ListItem[] {
    return this.store.selectSnapshot(MetadataState.disciplines);
  }

  private get phaseList(): ListItem[] {
    return this.store.selectSnapshot(MetadataState.phases);
  }

  run(project: Project, projectNodes: WbsNode[]): WbsNodeView[] {
    const nodes: WbsNodeView[] = [];
    const categories = <ListItem[]>(
      project.phases
        .map((x) =>
          typeof x === 'string' ? this.phaseList.find((c) => c.id === x) : x
        )
        .filter((x) => x)
    );
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const parentlevel = [i + 1];
      const node = projectNodes.find((x) => x.id === cat.id);
      const parent: WbsNodeView = {
        children: 0,
        description: node?.description ?? null,
        disciplines: node?.disciplineIds ?? [],
        id: cat.id,
        treeId: cat.id,
        levels: [...parentlevel],
        depth: 1,
        levelText: (i + 1).toString(),
        parentId: null,
        treeParentId: null,
        phaseId: cat.id,
        order: i + 1,
        title: this.resources.get(cat.label),
        canMoveDown: false,
        canMoveUp: false,
        canMoveLeft: false,
        canMoveRight: false,
        lastModified: new Date(0),
      };
      const children = this.getPhaseChildren(
        cat.id,
        cat.id,
        parentlevel,
        projectNodes
      );
      parent.children = children.length;

      nodes.push(parent, ...children);
    }
    return nodes;
  }

  private getPhaseChildren(
    phaseId: string,
    parentId: string,
    parentLevel: number[],
    list: WbsNode[]
  ): WbsNodeView[] {
    const results: WbsNodeView[] = [];
    const children = WbsNodeService.getSortedChildrenForPhase(parentId, list);

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childLevel = [...parentLevel, child.order];
      const node: WbsNodeView = {
        children: 0,
        description: child.description,
        disciplines: child.disciplineIds ?? [],
        id: child.id,
        treeId: child.id,
        levels: childLevel,
        levelText: childLevel.join('.'),
        depth: childLevel.length,
        order: child.order ?? 0,
        parentId: parentId,
        treeParentId: parentId,
        phaseId,
        title: child.title ?? '',
        lastModified: child.lastModified,
        canMoveDown: i !== children.length - 1,
        canMoveUp: i > 0,
        canMoveRight: i > 0,
        canMoveLeft: childLevel.length > 2,
      };

      const vmChildren = this.getPhaseChildren(
        phaseId,
        child.id,
        childLevel,
        list
      );

      node.children = vmChildren.length;

      results.push(node, ...vmChildren);
    }
    return results;
  }
}
