import {
  Category,
  LibraryEntry,
  LibraryEntryNode,
  ProjectNode,
  WbsNode,
} from '@wbs/core/models';
import { CategoryService } from '@wbs/core/services';
import { MembershipStore, MetadataStore } from '@wbs/core/store';
import {
  CategoryViewModel,
  LibraryEntryViewModel,
  LibraryTaskViewModel,
  ProjectTaskViewModel,
  TaskViewModel,
} from '@wbs/core/view-models';
import { WbsNodeService } from '../../../wbs-node.service';

export class WbsNodePhaseTransformer {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly membership: MembershipStore,
    private readonly metadata: MetadataStore
  ) {}

  private get phaseList(): Category[] {
    return this.metadata.categories.phases;
  }

  forLibrary(
    entry: LibraryEntry | LibraryEntryViewModel,
    models: LibraryEntryNode[],
    disciplines: CategoryViewModel[]
  ): LibraryTaskViewModel[] {
    const org = this.membership.membership()!.name;
    const owner =
      (entry as LibraryEntry).owner || (entry as LibraryEntryViewModel).ownerId;
    //
    //  Just in case somehow the unthinkable happen, return NOTHING!
    //
    if (org !== owner && entry.visibility === 'private') return [];

    const privateTasks =
      org === owner && entry.visibility === 'private'
        ? []
        : models.filter((x) => x.visibility === 'private').map((x) => x.id);

    const tasks: LibraryTaskViewModel[] = this.run(
      entry.type,
      models,
      disciplines,
      privateTasks
    );

    for (const task of privateTasks) {
      const vm = tasks.find((x) => x.id === task)!;

      vm.visibility = 'private';

      for (const child of vm.subTasks) {
        //child.visibility = 'impliedPrivate';
      }
    }

    return tasks;
  }

  forProject(
    models: ProjectNode[],
    disciplines: CategoryViewModel[]
  ): ProjectTaskViewModel[] {
    return this.run('project', models, disciplines, []);
  }

  private run(
    parentType: string,
    models: (ProjectNode | LibraryEntryNode)[],
    disciplines: CategoryViewModel[],
    privateTasks: string[]
  ): TaskViewModel[] {
    const phases = this.phaseList;
    const nodes: TaskViewModel[] = [];
    const rootNodes: WbsNode[] = models
      .filter((x) => !x.parentId)
      .sort((a, b) => a.order! - b.order!);

    for (let i = 0; i < rootNodes.length; i++) {
      const parentlevel = [i + 1];
      const node = rootNodes[i];
      const parent: TaskViewModel = {
        children: 0,
        childrenIds: [],
        description: node.description,
        disciplines: this.categoryService.buildTaskViewModels(
          disciplines,
          node?.disciplineIds
        ),
        id: node.id,
        treeId: node.id,
        levels: [...parentlevel],
        depth: 1,
        levelText: (i + 1).toString(),
        order: i + 1,
        title: node.title,
        canMoveLeft: false,
        canMoveUp: parentType === 'project' ? i > 0 : false,
        canMoveRight: parentType === 'project' ? i > 0 : false,
        canMoveDown:
          parentType === 'project' ? i < rootNodes.length - 1 : false,
        lastModified: node?.lastModified,
        subTasks: [],
        phaseIdAssociation: node.phaseIdAssociation,
      };

      if (parent.description === undefined && parent.phaseIdAssociation) {
        parent.description = phases.find(
          (x) => x.id === node.phaseIdAssociation
        )?.description;
      }

      const children = this.getPhaseChildren(
        disciplines,
        node.id,
        node.title,
        parent,
        parentType,
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
    disciplines: CategoryViewModel[],
    phaseId: string,
    phaseLabel: string,
    parent: TaskViewModel,
    type: string,
    list: WbsNode[]
  ): TaskViewModel[] {
    const results: TaskViewModel[] = [];
    const children = WbsNodeService.getSortedChildrenForPhase(parent.id, list);

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childLevel = [...parent.levels, child.order];
      const node: TaskViewModel = {
        children: 0,
        childrenIds: [],
        description: child.description,
        disciplines: this.categoryService.buildTaskViewModels(
          disciplines,
          child?.disciplineIds
        ),
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
        disciplines,
        phaseId,
        phaseLabel,
        node,
        type,
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
