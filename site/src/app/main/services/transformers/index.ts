import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Resources } from '@wbs/core/services';
import { WbsNodeService } from '../wbs-node.service';
import { ActivityTransformer } from './activity.transformer';
import { WbsNodeTransformers } from './nodes';

@Injectable()
export class Transformers {
  readonly nodes = new WbsNodeTransformers(
    this.resources,
    this.store,
    this.wbsService
  );
  readonly activities = ActivityTransformer;

  constructor(
    private readonly resources: Resources,
    private readonly store: Store,
    private readonly wbsService: WbsNodeService
  ) {}
}
