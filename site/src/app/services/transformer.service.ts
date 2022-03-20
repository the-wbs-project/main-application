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
    return vm;
  }

  wbsNodeTree(
    view: PROJECT_VIEW_TYPE,
    categories: Category[],
    list: WbsNode[]
  ): WbsNodeViewModel[] {
    const nodes: WbsNodeViewModel[] = [];

    for (const node of list) {
      const levels =
        (view === PROJECT_VIEW.DISCIPLINE
          ? node.levels.d![0]
          : node.levels.p) ?? [];

      nodes.push({
        activity: node.activity,
        depth: levels.length,
        id: node.id,
        level: levels.join('.'),
        levels,
        order: levels[levels.length - 1],
        parentId: null,
        parentLevel: levels.length === 1 ? null : levels.slice(0, -1).join('.'),
        phaseCategoryId: node.phaseCategoryId,
        referenceId: node.referenceId,
        thread: node.thread,
        title: node.title,
        trainingId: node.trainingId,
      });
    }
    //
    //  Now set parent Ids
    //
    for (const node of nodes) {
      if (node.parentLevel == null) continue;

      node.parentId =
        nodes.find((x) => x.level === node.parentLevel)?.id ?? null;
    }

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const topLevel = nodes.find((x) => x.phaseCategoryId === cat.id);

      if (!topLevel) continue;

      topLevel.title = this.resources.get(cat.label);
      topLevel.order = i;
    }
    return nodes;
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
