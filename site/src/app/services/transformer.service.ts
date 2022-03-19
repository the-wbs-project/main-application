import { Injectable } from '@angular/core';
import {
  Category,
  Project,
  PROJECT_VIEW,
  PROJECT_VIEW_TYPE,
  WbsNode,
} from '@app/models';
import { MetadataState } from '@app/states';
import { ProjectViewModel, WbsNodeViewModel } from '@app/view-models';
import { Store } from '@ngxs/store';
import { Resources } from './resource.service';

@Injectable({ providedIn: 'root' })
export class Transformer {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  project(p: Project): ProjectViewModel {
    const vm: ProjectViewModel = {
      ...p,
      categories: new Map<PROJECT_VIEW_TYPE, Category[]>(),
    };
    vm.categories.set(
      PROJECT_VIEW.DISCIPLINE,
      this.catList(p.categories.d, PROJECT_VIEW.DISCIPLINE)
    );
    vm.categories.set(
      PROJECT_VIEW.PHASE,
      this.catList(p.categories.p, PROJECT_VIEW.PHASE)
    );
    console.log(vm);
    return vm;
  }

  wbsNodeTree(
    view: PROJECT_VIEW_TYPE,
    categories: Category[],
    list: WbsNode[]
  ): WbsNodeViewModel[] {
    const nodes: WbsNodeViewModel[] = [];

    console.log(categories);

    for (const node of list) {
      const levels =
        (view === PROJECT_VIEW.DISCIPLINE ? node.levels.d : node.levels.p) ??
        [];

      nodes.push({
        activity: node.activity,
        depth: levels.length,
        id: node.id,
        level: levels.join('.'),
        levels,
        order: levels[levels.length - 1],
        parentLevel:
          levels.length === 1
            ? null
            : levels.slice(0, levels.length - 2).join('.'),
        categoryId: node.categoryId,
        referenceId: node.referenceId,
        thread: node.thread,
        title: node.title,
        trainingId: node.trainingId,
      });
    }
    const toReturn: WbsNodeViewModel[] = [];
    for (const cat of categories) {
      const topLevel = nodes.find((x) => x.categoryId === cat.id);

      if (!topLevel) continue;

      topLevel.title = this.resources.get(cat.label);

      this.addWbsChildren(topLevel, nodes);
      toReturn.push(topLevel);
    }
    console.log(this.sortWbsNodes(toReturn));
    return this.sortWbsNodes(toReturn);
  }

  addWbsChildren(node: WbsNodeViewModel, list: WbsNodeViewModel[]): void {
    const children = list.filter(
      (x) => x.depth === node.depth + 1 && x.level.startsWith(node.level + '.')
    );

    if (children.length > 0) {
      for (const child of children) {
        this.addWbsChildren(child, list);
      }
      node.children = this.sortWbsNodes(children);
    } else {
      node.children = null;
    }
  }

  sortWbsNodes(list: WbsNodeViewModel[]): WbsNodeViewModel[] {
    return list.sort((a, b) => (a.order < b.order ? -1 : 1));
  }

  private catList(ids: string[], view: PROJECT_VIEW_TYPE): Category[] {
    const list: Category[] = [];
    const cats =
      this.store.selectSnapshot(MetadataState.categoryMap).get(view) ??
      new Map<string, Category>();

    for (const id of ids) {
      const cat = cats.get(id);

      if (cat) list.push(cat);
    }
    return list;
  }
}
