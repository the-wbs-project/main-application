import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Resources } from '../resource.service';
import { ActivityTransformer } from './activity.transformer';
import { WbsNodeTransformers } from './nodes';

@Injectable({ providedIn: 'root' })
export class Transformers {
  readonly nodes = new WbsNodeTransformers(this.resources, this.store);
  readonly activities = ActivityTransformer;

  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}
}
