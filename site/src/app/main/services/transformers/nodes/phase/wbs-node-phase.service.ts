import { Store } from '@ngxs/store';
import { ListItem, ProjectCategory, WbsNode } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { WbsNodeService } from '@wbs/main/services';
import { MetadataState } from '@wbs/main/states';

export class WbsNodePhaseTransformer {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  private get phaseList(): ListItem[] {
    return this.store.selectSnapshot(MetadataState.phases);
  }

  run(models: WbsNode[], phases?: ProjectCategory[]): WbsNodeView[] {
    const nodes: WbsNodeView[] = [];
    let rootNodes: WbsNode[] = [];

    if (phases) {
      const categories = <ListItem[]>(
        phases
          .map((x) =>
            typeof x === 'string' ? this.phaseList.find((c) => c.id === x) : x
          )
          .filter((x) => x)
      );

      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        let node = models.find((x) => x.id === cat.id)!;
        let label = (node?.title ?? '').trim();
        let description = (node?.description ?? '').trim();

        const catLabel =
          !cat.label && (cat.sameAs ?? []).length > 0
            ? this.phaseList.find((c) => c.id === cat.sameAs![0])?.label
            : cat.label;

        const catDescription =
          !cat.description && (cat.sameAs ?? []).length > 0
            ? this.phaseList.find((c) => c.id === cat.sameAs![0])?.description
            : cat.description;

        if (label === '' || label === catLabel) {
          label = this.resources.get(catLabel!);
        }
        if (description === '' || description === catDescription) {
          description = this.resources.get(catDescription!);
        }
        if (node) {
          node.title = label;
          node.description = description;
          node.order = i + 1;
        } else {
          node = {
            id: cat.id,
            title: label,
            description,
            order: i + 1,
            parentId: undefined,
            disciplineIds: [],
            lastModified: new Date(),
          };
        }
        rootNodes.push(node);
      }
    } else {
      rootNodes = models
        .filter((x) => !x.parentId)
        .sort((a, b) => a.order! - b.order!);
    }
    for (let i = 0; i < rootNodes.length; i++) {
      const parentlevel = [i + 1];
      const node = rootNodes[i];
      const parent: WbsNodeView = {
        children: 0,
        childrenIds: [],
        description: node.description,
        disciplines: node?.disciplineIds ?? [],
        id: node.id,
        treeId: node.id,
        levels: [...parentlevel],
        depth: 1,
        levelText: (i + 1).toString(),
        phaseId: node.id,
        order: i + 1,
        title: node.title,
        canMoveDown: i < rootNodes.length - 1,
        canMoveUp: i > 0,
        canMoveLeft: false,
        canMoveRight: i > 0,
        lastModified: node?.lastModified,
        subTasks: [],
      };
      const children = this.getPhaseChildren(
        node.id,
        node.id,
        parentlevel,
        models
      );
      parent.children = children.length;
      parent.childrenIds = children.map((x) => x.id);

      parent.subTasks = structuredClone(children);

      for (const task of parent.subTasks) {
        if (task.treeParentId === parent.id) task.treeParentId = undefined;
      }

      nodes.push(parent, ...children);
    }

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].previousTaskId = i > 0 ? nodes[i - 1].id : undefined;
      nodes[i].nextTaskId = i < nodes.length - 1 ? nodes[i + 1].id : undefined;
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
        childrenIds: [],
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
        canMoveLeft: true,
        subTasks: [],
      };

      const taskChildren = this.getPhaseChildren(
        phaseId,
        child.id,
        childLevel,
        list
      );

      node.children = taskChildren.length;
      node.childrenIds = taskChildren.map((x) => x.id);
      node.subTasks = structuredClone(taskChildren);

      for (const task of node.subTasks) {
        if (task.treeParentId === node.id) task.treeParentId = undefined;
      }

      results.push(node, ...taskChildren);
    }
    return results;
  }
}
