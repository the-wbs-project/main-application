import { Store } from '@ngxs/store';
import { Resources } from '../../../../../core/services/resource.service';
import { WbsDisciplineNodeTransformer } from './wbs-node-discipline.service';

export class WbsDisciplineNodeTransformers {
  readonly view = new WbsDisciplineNodeTransformer(this.resources, this.store);

  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}
}
