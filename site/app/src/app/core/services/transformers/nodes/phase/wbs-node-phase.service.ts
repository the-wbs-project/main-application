import { Category, ProjectCategory, WbsNode } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { MetadataStore } from '@wbs/core/store';
import { WbsNodeService } from '../../../wbs-node.service';

export class WbsNodePhaseTransformer {
  constructor(
    private readonly metadata: MetadataStore,
    private readonly resources: Resources
  ) {}

  private get phaseList(): Category[] {
    return this.metadata.categories.phases;
  }

  run(
    models: WbsNode[],
    type: string,
    disciplines: ProjectCategory[] | Category[]
  ): WbsNodeView[] {
    const phases = this.phaseList;
    const nodes: WbsNodeView[] = [];
    const wbsDisciplines = disciplines.map((x) => x.id);
    const rootNodes: WbsNode[] = models
      .filter((x) => !x.parentId)
      .sort((a, b) => a.order! - b.order!);

    for (let i = 0; i < rootNodes.length; i++) {
      const parentlevel = [i + 1];
      const node = rootNodes[i];
      const phaseObj = phases.find((x) => x.id === node.phaseIdAssociation);
      const parent: WbsNodeView = {
        children: 0,
        childrenIds: [],
        description: node.description,
        disciplines: this.getDisciplines(node?.disciplineIds, wbsDisciplines),
        id: node.id,
        treeId: node.id,
        levels: [...parentlevel],
        depth: 1,
        levelText: (i + 1).toString(),
        order: i + 1,
        title: node.title,
        canMoveLeft: false,
        canMoveUp: type === 'project' ? i > 0 : false,
        canMoveRight: type === 'project' ? i > 0 : false,
        canMoveDown: type === 'project' ? i < rootNodes.length - 1 : false,
        lastModified: node?.lastModified,
        subTasks: [],
        phaseIdAssociation: node.phaseIdAssociation,
      };
      if (phaseObj && parent.description === undefined) {
        parent.description = phaseObj.description;
      }
      const phaseId = phaseObj ? phaseObj.id : node.id;
      const phaseLabel = phaseObj
        ? this.resources.get(phaseObj.label)
        : node.title;

      const children = this.getPhaseChildren(
        phaseId,
        phaseLabel,
        parent,
        type,
        models,
        wbsDisciplines
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
    phaseLabel: string,
    parent: WbsNodeView,
    type: string,
    list: WbsNode[],
    wbsDisciplines: string[]
  ): WbsNodeView[] {
    const results: WbsNodeView[] = [];
    const children = WbsNodeService.getSortedChildrenForPhase(parent.id, list);

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childLevel = [...parent.levels, child.order];
      const node: WbsNodeView = {
        children: 0,
        childrenIds: [],
        description: child.description,
        disciplines: this.getDisciplines(child.disciplineIds, wbsDisciplines),
        id: child.id,
        treeId: child.id,
        levels: childLevel,
        levelText: childLevel.join('.'),
        depth: childLevel.length,
        order: child.order ?? 0,
        parent,
        parentId: parent.id,
        treeParentId: parent.id,
        title: child.title ?? '',
        lastModified: child.lastModified,
        canMoveDown: i !== children.length - 1,
        canMoveUp: i > 0,
        canMoveRight: i > 0,
        canMoveLeft: type === 'project' || parent.levelText.length > 1,
        subTasks: [],
        phaseIdAssociation: child.phaseIdAssociation,
        phaseId,
        phaseLabel,
      };

      const taskChildren = this.getPhaseChildren(
        phaseId,
        phaseLabel,
        node,
        type,
        list,
        wbsDisciplines
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

  private getDisciplines(
    taskDisciplines: string[] | undefined,
    wbsDisciplines: string[]
  ): string[] {
    return taskDisciplines?.filter((x) => wbsDisciplines.includes(x)) ?? [];
  }
}
