import { Injectable } from '@angular/core';
import { Resources } from '@wbs/core/services';
import { CategoryState } from '../category-state.service';
import { WbsNodeService } from '../wbs-node.service';
import { ActivityTransformer } from './activity.transformer';
import { WbsNodeTransformers } from './nodes';

@Injectable()
export class Transformers {
  readonly nodes = new WbsNodeTransformers(
    this.categoryState,
    this.resources,
    this.wbsService
  );
  readonly activities = ActivityTransformer;

  constructor(
    private readonly categoryState: CategoryState,
    private readonly resources: Resources,
    private readonly wbsService: WbsNodeService
  ) {}
}
