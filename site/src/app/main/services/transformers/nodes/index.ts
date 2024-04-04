import { Resources } from '@wbs/core/services';
import { MetadataState } from '../../metdata-state.service';
import { WbsNodeService } from '../../wbs-node.service';
import { WbsDisciplineNodeTransformers } from './discipline';
import { WbsPhaseNodeTransformers } from './phase';

export class WbsNodeTransformers {
  readonly discipline = new WbsDisciplineNodeTransformers(
    this.metadata,
    this.resources,
    this.wbsService
  );
  readonly phase = new WbsPhaseNodeTransformers(this.metadata, this.resources);

  constructor(
    private readonly metadata: MetadataState,
    private readonly resources: Resources,
    private readonly wbsService: WbsNodeService
  ) {}
}
