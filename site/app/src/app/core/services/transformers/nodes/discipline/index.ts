import { MetadataStore } from '@wbs/core/store';
import { WbsNodeService } from '../../../wbs-node.service';
import { WbsDisciplineNodeTransformer } from './wbs-node-discipline.service';

export class WbsDisciplineNodeTransformers {
  readonly view = new WbsDisciplineNodeTransformer(
    this.metadata,
    this.wbsService
  );

  constructor(
    private readonly metadata: MetadataStore,
    private readonly wbsService: WbsNodeService
  ) {}
}
