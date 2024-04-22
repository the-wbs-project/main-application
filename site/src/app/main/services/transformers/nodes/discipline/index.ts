import { Resources } from '@wbs/core/services/resource.service';
import { WbsNodeService } from '@wbs/main/services';
import { MetadataStore } from '@wbs/store';
import { WbsDisciplineNodeTransformer } from './wbs-node-discipline.service';

export class WbsDisciplineNodeTransformers {
  readonly view = new WbsDisciplineNodeTransformer(
    this.categories,
    this.resources,
    this.wbsService
  );

  constructor(
    private readonly categories: MetadataStore,
    private readonly resources: Resources,
    private readonly wbsService: WbsNodeService
  ) {}
}
