import { Injectable } from '@angular/core';
import { ListItem, WbsNode } from '@wbs/shared/models';
import { WbsNodeView } from '@wbs/shared/view-models';

@Injectable()
export class ReorderProcessor {
  run(
    originals: WbsNode[],
    viewModels: WbsNodeView[],
    reordered: WbsNodeView[]
  ): WbsNode[] {
    const upserts: WbsNode[] = [];

    for (const vm of viewModels) {
      const vm2 = reordered.find((x) => x.id === vm.id);

      if (!vm2) continue;
      if (vm.order === vm2.order || vm.parentId !== vm2.parentId) continue;

      const orig = originals.find((x) => x.id === vm.id)!;
      const model = this.copy(orig);

      model.order = vm2.order;
      model.parentId = vm2.parentId;

      upserts.push(model);
    }

    return upserts;
  }

  private copy<T>(x: T): T {
    return <T>JSON.parse(JSON.stringify(x));
  }
}
