import { Store } from '@ngxs/store';
import { Resources } from '@wbs/core/services';
import { WbsNodeService } from '../../wbs-node.service';
import { WbsDisciplineNodeTransformers } from './discipline';
import { WbsPhaseNodeTransformers } from './phase';

export class WbsNodeTransformers {
  readonly discipline = new WbsDisciplineNodeTransformers(
    this.resources,
    this.store,
    this.wbsService
  );
  readonly phase = new WbsPhaseNodeTransformers(this.resources, this.store);

  constructor(
    private readonly resources: Resources,
    private readonly store: Store,
    private readonly wbsService: WbsNodeService
  ) {}
}
