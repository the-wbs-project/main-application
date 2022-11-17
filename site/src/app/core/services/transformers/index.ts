import { Injectable } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { Resources } from '../resource.service';
import { WbsNodeTransformers } from './nodes';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class WbsTransformers {
  readonly nodes = new WbsNodeTransformers(this.resources, this.store);

  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}
}
