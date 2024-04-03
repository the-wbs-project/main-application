import { Resources } from '@wbs/core/services';
import { CategoryState } from '../../category-state.service';
import { WbsNodeService } from '../../wbs-node.service';
import { WbsDisciplineNodeTransformers } from './discipline';
import { WbsPhaseNodeTransformers } from './phase';

export class WbsNodeTransformers {
  readonly discipline = new WbsDisciplineNodeTransformers(
    this.categoryState,
    this.resources,
    this.wbsService
  );
  readonly phase = new WbsPhaseNodeTransformers(
    this.categoryState,
    this.resources
  );

  constructor(
    private readonly categoryState: CategoryState,
    private readonly resources: Resources,
    private readonly wbsService: WbsNodeService
  ) {}
}
