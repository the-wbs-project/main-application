import { Injectable } from '@angular/core';
import {
  Category,
  Project,
  PROJECT_VIEW,
  PROJECT_VIEW_TYPE,
  WbsNode,
} from '@app/models';
import { MetadataState } from '@app/states';
import { ProjectViewModel } from '@app/view-models';
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
