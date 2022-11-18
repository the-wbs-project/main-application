import { Store } from '@ngxs/store';
import { Resources } from '../../../resource.service';
import { WbsNodePhaseImporter } from './wbs-node-phase-importer.service';
import { WbsNodePhaseReorderer } from './wbs-node-phase-reorderer.service';
import { WbsNodePhaseTransformer } from './wbs-node-phase.service';

export class WbsPhaseNodeTransformers {
  readonly view = new WbsNodePhaseTransformer(this.resources, this.store);
  readonly reorderer = new WbsNodePhaseReorderer();
  readonly importer = new WbsNodePhaseImporter();

  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}
}
