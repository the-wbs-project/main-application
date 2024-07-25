import { Injectable } from '@angular/core';
import { CategoryService } from '@wbs/core/services';
import { MembershipStore, MetadataStore } from '@wbs/core/store';
import { WbsNodeService } from '../wbs-node.service';
import { ActivityTransformer } from './activity.transformer';
import { WbsNodeTransformers } from './nodes';

@Injectable({ providedIn: 'root' })
export class Transformers {
  readonly nodes = new WbsNodeTransformers(
    this.categoryService,
    this.membership,
    this.metadata,
    this.wbsService
  );
  readonly activities = ActivityTransformer;

  constructor(
    private readonly categoryService: CategoryService,
    private readonly membership: MembershipStore,
    private readonly metadata: MetadataStore,
    private readonly wbsService: WbsNodeService
  ) {}
}
