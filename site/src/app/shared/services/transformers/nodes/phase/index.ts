import { Store } from '@ngxs/store';
import { Resources } from '../../../resource.service';
import { WbsNodePhaseReorderer } from './wbs-node-phase-reorderer.service';
import { WbsNodePhaseTransformer } from './wbs-node-phase.service';

export class WbsPhaseNodeTransformers {
  readonly view = new WbsNodePhaseTransformer(this.resources, this.store);
  readonly reorderer = new WbsNodePhaseReorderer();

  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}
}
