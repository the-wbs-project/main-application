import {
  Category,
  LibraryEntryNode,
  ProjectCategory,
  ProjectNode,
  WbsNode,
} from '@wbs/core/models';
import { MembershipStore, MetadataStore } from '@wbs/core/store';
import {
  LibraryTaskViewModel,
  ProjectTaskViewModel,
  TaskViewModel,
  LibraryVersionViewModel,
} from '@wbs/core/view-models';
import { CategoryService } from '../../../category.service';
import { sorter } from '../../../sorter.service';
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
    version: LibraryVersionViewModel | undefined,
    models: LibraryEntryNode[],
    disciplines: ProjectCategory[]
  ): LibraryTaskViewModel[] {
    if (!version) return [];

    const org = this.membership.membership()!.name;
    const owner = version.ownerId;
    //
    //  Just in case somehow the unthinkable happen, return NOTHING!
    //
    if (org !== owner && version.visibility === 'private') return [];

    const privateTasks =
      org === owner && version.visibility === 'private'
        ? []
        : models.filter((x) => x.visibility === 'private').map((x) => x.id);

    const tasks: LibraryTaskViewModel[] = this.run(
      version.type,
      models,
      disciplines
    );

    for (const task of privateTasks) {
      const vm = tasks.find((x) => x.id === task)!;

      vm.visibility = 'private';

      for (const childId of vm.childrenIds) {
        const child = tasks.find((x) => x.id === childId)!;

        child.visibility = 'impliedPrivate';
      }
    }

    return tasks;
  }

  forProject(
    models: ProjectNode[],
    disciplines: ProjectCategory[]
  ): ProjectTaskViewModel[] {
    const tasks: ProjectTaskViewModel[] = this.run(
      'project',
      models,
      disciplines
    );

    const setParent = (taskId: string) => {
      const task = tasks.find((x) => x.id === taskId)!;

      task.absFlag = 'implied';

      if (task.parentId) setParent(task.parentId);
    };

    for (const task of models.filter((x) => x.absFlag)) {
      const taskVm = tasks.find((x) => x.id === task.id)!;

      taskVm.absFlag = 'set';

      if (task.parentId) setParent(task.parentId);
    }

    return tasks;
  }

  forAbsProject(
    models: ProjectNode[],
    disciplines: ProjectCategory[]
  ): ProjectTaskViewModel[] {
    const tasks = this.forProject(models, disciplines).filter((x) => x.absFlag);

    const rebuild = (parent: ProjectTaskViewModel | undefined) => {
      const children = tasks
        .filter((x) => x.parentId === parent?.id)
        .sort((a, b) => sorter(a.order, b.order));

      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        child.order = i + 1;
        child.levels = parent ? [...parent.levels, i + 1] : [i + 1];
        child.levelText = child.levels.join('.');

        rebuild(child);
      }
    };

    rebuild(undefined);

    return tasks;
  }

  private run(
    parentType: string,
    models: (ProjectNode | LibraryEntryNode)[],
    disciplines: ProjectCategory[]
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

      nodes.push(parent, ...children);
    }

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].previousTaskId = i > 0 ? nodes[i - 1].id : undefined;
      nodes[i].nextTaskId = i < nodes.length - 1 ? nodes[i + 1].id : undefined;
    }
    return nodes;
  }

  private getPhaseChildren(
    disciplines: ProjectCategory[],
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
        parentId: parent.id,
        treeParentId: parent.id,
        title: child.title ?? '',
        lastModified: child.lastModified,
        canMoveDown: i !== children.length - 1,
        canMoveUp: i > 0,
        canMoveRight: i > 0,
        canMoveLeft: type === 'project' || parent.levelText.length > 1,
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

      results.push(node, ...taskChildren);
    }
    return results;
  }
}
