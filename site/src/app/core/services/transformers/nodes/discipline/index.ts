import { WbsNodeService } from '../../../wbs-node.service';
import { WbsDisciplineNodeTransformer } from './wbs-node-discipline.service';

export class WbsDisciplineNodeTransformers {
  readonly view = new WbsDisciplineNodeTransformer(this.wbsService);

  constructor(private readonly wbsService: WbsNodeService) {}
}
