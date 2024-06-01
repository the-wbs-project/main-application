import { CategoryService } from '../../../category.service';
import { WbsNodeService } from '../../../wbs-node.service';
import { WbsDisciplineNodeTransformer } from './wbs-node-discipline.service';

export class WbsDisciplineNodeTransformers {
  readonly view = new WbsDisciplineNodeTransformer(
    this.categoryService,
    this.wbsService
  );

  constructor(
    private readonly categoryService: CategoryService,
    private readonly wbsService: WbsNodeService
  ) {}
}
