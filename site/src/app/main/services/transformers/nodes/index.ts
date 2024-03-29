import { Store } from '@ngxs/store';
import { Resources } from '../../../../core/services/resource.service';
import { WbsDisciplineNodeTransformers } from './discipline';
import { WbsPhaseNodeTransformers } from './phase';

export class WbsNodeTransformers {
  readonly discipline = new WbsDisciplineNodeTransformers(
    this.resources,
    this.store
  );
  readonly phase = new WbsPhaseNodeTransformers(this.resources, this.store);

  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}
}
