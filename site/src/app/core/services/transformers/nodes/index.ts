import { MembershipStore, MetadataStore } from '@wbs/core/store';
import { WbsNodeService } from '../../wbs-node.service';
import { WbsDisciplineNodeTransformers } from './discipline';
import { WbsPhaseNodeTransformers } from './phase';

export class WbsNodeTransformers {
  readonly discipline = new WbsDisciplineNodeTransformers(this.wbsService);
  readonly phase = new WbsPhaseNodeTransformers(this.membership, this.metadata);

  constructor(
    private readonly membership: MembershipStore,
    private readonly metadata: MetadataStore,
    private readonly wbsService: WbsNodeService
  ) {}
}
