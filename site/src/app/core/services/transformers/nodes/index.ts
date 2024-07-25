import { CategoryService } from '@wbs/core/services';
import { MembershipStore, MetadataStore } from '@wbs/core/store';
import { WbsNodeService } from '../../wbs-node.service';
import { WbsDisciplineNodeTransformers } from './discipline';
import { WbsPhaseNodeTransformers } from './phase';

export class WbsNodeTransformers {
  readonly discipline = new WbsDisciplineNodeTransformers(
    this.categoryService,
    this.wbsService
  );
  readonly phase = new WbsPhaseNodeTransformers(
    this.categoryService,
    this.membership,
    this.metadata
  );

  constructor(
    private readonly categoryService: CategoryService,
    private readonly membership: MembershipStore,
    private readonly metadata: MetadataStore,
    private readonly wbsService: WbsNodeService
  ) {}
}
