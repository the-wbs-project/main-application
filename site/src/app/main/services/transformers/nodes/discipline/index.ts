import { Store } from '@ngxs/store';
import { Resources } from '@wbs/core/services/resource.service';
import { WbsNodeService } from '@wbs/main/services';
import { WbsDisciplineNodeTransformer } from './wbs-node-discipline.service';

export class WbsDisciplineNodeTransformers {
  readonly view = new WbsDisciplineNodeTransformer(
    this.resources,
    this.store,
    this.wbsService
  );

  constructor(
    private readonly resources: Resources,
    private readonly store: Store,
    private readonly wbsService: WbsNodeService
  ) {}
}
