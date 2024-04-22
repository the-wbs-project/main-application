import { Injectable } from '@angular/core';
import { Resources } from '@wbs/core/services';
import { MetadataStore } from '@wbs/store';
import { WbsNodeService } from '../wbs-node.service';
import { ActivityTransformer } from './activity.transformer';
import { WbsNodeTransformers } from './nodes';

@Injectable()
export class Transformers {
  readonly nodes = new WbsNodeTransformers(
    this.metadata,
    this.resources,
    this.wbsService
  );
  readonly activities = ActivityTransformer;

  constructor(
    private readonly metadata: MetadataStore,
    private readonly resources: Resources,
    private readonly wbsService: WbsNodeService
  ) {}
}
