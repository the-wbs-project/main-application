import { LibraryEntryNode, ProjectNode, WbsNode } from '@wbs/core/models';
import { MembershipStore, MetadataStore } from '@wbs/core/store';
import {
  CategoryViewModel,
  LibraryTaskViewModel,
  LibraryVersionViewModel,
  ProjectTaskViewModel,
  TaskViewModel,
} from '@wbs/core/view-models';
import { sorter } from '../../../sorter.service';
import { WbsNodeService } from '../../../wbs-node.service';

export class WbsNodePhaseTransformer {
  constructor(
    private readonly membership: MembershipStore,
    private readonly metadata: MetadataStore
  ) {}

  forLibrary(
    version: LibraryVersionViewModel | undefined,
    models: LibraryEntryNode[],
    disciplines: CategoryViewModel[]
  ): LibraryTaskViewModel[] {
    if (!version) return [];

    const org = this.membership.membership()!.id;
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
    disciplines: CategoryViewModel[]
  ): ProjectTaskViewModel[] {
    const tasks: ProjectTaskViewModel[] = this.run(
      'project',
      models,
      disciplines
    );

    for (const task of models.filter((x) => x.absFlag)) {
      const vm = tasks.find((x) => x.id === task.id)!;

      vm.absFlag = 'set';
    }

    this.updateAbsFlags(tasks);

    return tasks;
  }

  updateAbsFlags(
    tasks: { id: string; parentId?: string; absFlag?: 'set' | 'implied' }[]
  ): void {
    const ids: string[] = [];

    const setParent = (taskId: string) => {
      const task = tasks.find((x) => x.id === taskId)!;

      task.absFlag = 'implied';

      ids.push(task.id);

      if (task.parentId) setParent(task.parentId);
    };

    for (const task of tasks.filter((x) => x.absFlag === 'set')) {
      ids.push(task.id);

      if (task.parentId) setParent(task.parentId);
    }

    for (const task of tasks.filter((x) => !ids.includes(x.id))) {
      task.absFlag = undefined;
    }
  }

  forAbsProject(
    models: ProjectNode[],
    disciplines: CategoryViewModel[]
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
    disciplines: CategoryViewModel[]
  ): TaskViewModel[] {
    const phases = this.metadata.categories.phases;
    const nodes: TaskViewModel[] = [];
    const rootNodes: WbsNode[] = models
      .filter((x) => !x.parentId)
      .sort((a, b) => sorter(a.order, b.order));

    for (let i = 0; i < rootNodes.length; i++) {
      const parentlevel = [i + 1];
      const node = rootNodes[i];
      const parent: TaskViewModel = {
        children: 0,
        childrenIds: [],
        description: node.description,
        disciplines: disciplines.filter((x) =>
          node.disciplineIds?.includes(x.id)
        ),
        id: node.id,
        levels: [...parentlevel],
        levelText: (i + 1).toString(),
        order: i + 1,
        title: node.title,
        createdOn: node.createdOn,
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
        parent,
        parentType,
        models
      );
      parent.children = children.length;
      parent.childrenIds = children.map((x) => x.id);

      nodes.push(parent, ...children);
    }

    return nodes;
  }

  private getPhaseChildren(
    disciplines: CategoryViewModel[],
    phaseId: string,
    parent: TaskViewModel,
    type: string,
    list: WbsNode[]
  ): TaskViewModel[] {
    const results: TaskViewModel[] = [];
    const children = WbsNodeService.getSortedChildrenForPhase(parent.id, list);

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childLevel = [...parent.levels, i + 1];
      const node: TaskViewModel = {
        children: 0,
        childrenIds: [],
        description: child.description,
        disciplines: disciplines.filter((x) =>
          child.disciplineIds?.includes(x.id)
        ),
        id: child.id,
        levels: childLevel,
        levelText: childLevel.join('.'),
        order: i + 1,
        parentId: parent.id,
        title: child.title ?? '',
        createdOn: child.createdOn,
        lastModified: child.lastModified,
        canMoveDown: i !== children.length - 1,
        canMoveUp: i > 0,
        canMoveRight: i > 0,
        canMoveLeft: type === 'project' || parent.levelText.length > 1,
        phaseIdAssociation: child.phaseIdAssociation,
        phaseId,
      };

      const taskChildren = this.getPhaseChildren(
        disciplines,
        phaseId,
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
