import { Store } from '@ngxs/store';
import { Category, ProjectCategory, WbsNode } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { WbsNodeService } from '@wbs/main/services';
import { MetadataState } from '@wbs/main/states';

export class WbsNodePhaseTransformer {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  private get phaseList(): Category[] {
    return this.store.selectSnapshot(MetadataState.phases);
  }

  run(
    models: WbsNode[],
    phases: ProjectCategory[],
    disciplines: ProjectCategory[]
  ): WbsNodeView[] {
    const nodes: WbsNodeView[] = [];
    let rootNodes: WbsNode[] = [];
    const phaseList = this.phaseList;
    const phaseInfo: { id: string; label: string }[] = [];
    const wbsDisciplines = disciplines.map((x) =>
      typeof x === 'string' ? x : x.id
    );

    if (phases) {
      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        const phaseId = typeof phase === 'string' ? phase : phase.id;

        let node = models.find((x) => x.phaseIdAssociation === phaseId)!;
        let label = (node?.title ?? '').trim();
        let description = (node?.description ?? '').trim();

        const catLabel =
          label.length > 0
            ? label
            : typeof phase === 'string'
            ? phaseList.find((x) => x.id === phaseId)?.label ?? ''
            : phase.label;

        phaseInfo.push({ id: phaseId, label: catLabel });
        if (label === '') {
          label =
            typeof phase === 'string'
              ? phaseList.find((x) => x.id === phase)?.label ?? ''
              : phase.label;
        }
        if (node) {
          node.title = label;
          node.description = description;
          node.order = i + 1;
        } else {
          node = {
            id: phaseId,
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
        disciplines: this.getDisciplines(node?.disciplineIds, wbsDisciplines),
        id: node.id,
        treeId: node.id,
        levels: [...parentlevel],
        depth: 1,
        levelText: (i + 1).toString(),
        phaseIdAssociation: node.phaseIdAssociation,
        phaseId: phaseInfo[i].id,
        phaseLabel: phaseInfo[i].label,
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
        phaseInfo[i].id,
        phaseInfo[i].label,
        parent,
        'project',
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

  runv2(
    models: WbsNode[],
    type: string,
    disciplines: ProjectCategory[]
  ): WbsNodeView[] {
    const phases = this.phaseList;
    const nodes: WbsNodeView[] = [];
    const wbsDisciplines = disciplines.map((x) =>
      typeof x === 'string' ? x : x.id
    );
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
