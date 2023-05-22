import { LISTS, ListItem, WbsNode } from '../../models';
import { WbsNodeView } from '../../view-models';
import { DataServiceFactory } from '../data-services';
import { ResourceService } from '../resource.service';
import { WbsNodeService } from '../wbs-node.service';

export class WbsNodePhaseTransformer {
  constructor(private readonly data: DataServiceFactory) {}

  async runAsync(projectId: string): Promise<WbsNodeView[]> {
    let [disciplineList, phaseList, resourceList, project, projectNodes] = await Promise.all([
      this.data.lists.getAsync(LISTS.DISCIPLINE),
      this.data.lists.getAsync(LISTS.PHASE),
      this.data.resources.getAllAsync('en-US'),
      this.data.projects.getAsync(projectId),
      this.data.projectNodes.getAllAsync(projectId),
    ]);

    if (!project || !projectNodes) return [];

    const resources = new ResourceService(resourceList ?? []);
    const nodes: WbsNodeView[] = [];
    const categories = <ListItem[]>(
      project.categories.phase.map((x) => (typeof x === 'string' ? phaseList?.find((c) => c.id === x) : x)).filter((x) => x)
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
        levelText: (i + 1).toString(),
        parentId: null,
        treeParentId: null,
        phaseId: cat.id,
        order: i + 1,
        title: resources.get(cat.label),
        phaseInfo: {
          isDisciplineNode: false,
          isLockedToParent: false,
          syncWithDisciplines: false,
        },
        lastModified: 0,
        canMoveDown: false,
        canMoveUp: false,
        canMoveLeft: false,
        canMoveRight: false,
      };
      const children = this.getPhaseChildren(cat.id, cat.id, parentlevel, projectNodes, false, disciplineList, resources);
      parent.children = this.getChildCount(children);

      nodes.push(parent, ...children);
    }
    return nodes;
  }

  private getPhaseChildren(
    phaseId: string,
    parentId: string,
    parentLevel: number[],
    list: WbsNode[],
    isLockedToParent: boolean,
    disciplineList: ListItem[] | undefined,
    resources: ResourceService,
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
        order: child.order ?? 0,
        parentId: parentId,
        treeParentId: parentId,
        phaseId,
        title: child.title ?? '',
        phaseInfo: {
          isDisciplineNode: child.phase?.isDisciplineNode ?? false,
          isLockedToParent,
          syncWithDisciplines: child.phase?.syncWithDisciplines ?? false,
        },
        lastModified: child.lastModified,
        canMoveDown: i !== children.length - 1,
        canMoveUp: i > 0,
        canMoveRight: i > 0,
        canMoveLeft: childLevel.length > 2,
      };
      if (node.phaseInfo?.isDisciplineNode) {
        const dCat = disciplineList?.find((x) => x.id === (node.disciplines ?? [])[0]);

        if (dCat) node.title = resources.get(dCat.label);
      }
      const vmChildren = this.getPhaseChildren(
        phaseId,
        child.id,
        childLevel,
        list,
        child.phase?.syncWithDisciplines ?? false,
        disciplineList,
        resources,
      );

      node.children = this.getChildCount(vmChildren);

      results.push(node, ...vmChildren);
    }
    return results;
  }

  private getChildCount(children: WbsNodeView[]): number {
    return children.map((x) => x.children + 1).reduce((partialSum, a) => partialSum + a, 0);
  }
}
