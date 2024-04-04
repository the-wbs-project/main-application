import { Resources } from '@wbs/core/services/resource.service';
import { MetadataState, WbsNodeService } from '@wbs/main/services';
import { WbsDisciplineNodeTransformer } from './wbs-node-discipline.service';

export class WbsDisciplineNodeTransformers {
  readonly view = new WbsDisciplineNodeTransformer(
    this.categories,
    this.resources,
    this.wbsService
  );

  constructor(
    private readonly categories: MetadataState,
    private readonly resources: Resources,
    private readonly wbsService: WbsNodeService
  ) {}
}
