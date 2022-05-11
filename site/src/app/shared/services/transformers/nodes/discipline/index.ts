import { Store } from '@ngxs/store';
import { Resources } from '../../../resource.service';
import { WbsDisciplineReorderer } from './wbs-node-discipline-reorderer.service';
import { WbsDisciplineNodeTransformer } from './wbs-node-discipline.service';

export class WbsDisciplineNodeTransformers {
  readonly view = new WbsDisciplineNodeTransformer(this.resources, this.store);
  readonly reorderer = new WbsDisciplineReorderer();

  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}
}
