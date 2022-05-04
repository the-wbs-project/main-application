import { Injectable } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { Resources } from '../resource.service';
import { WbsDisciplineReorderer } from './wbs-node-discipline-reorderer.service';
import { WbsDisciplineNodeTransformer } from './wbs-node-discipline.service';
import { WbsNodePhaseReorderer } from './wbs-node-phase-reorderer.service';
import { WbsNodePhaseTransformer } from './wbs-node-phase.service';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class Transformers {
  readonly wbsNodeDiscipline = new WbsDisciplineNodeTransformer(
    this.resources,
    this.store
  );
  readonly wbsNodePhase = new WbsNodePhaseTransformer(
    this.resources,
    this.store
  );
  readonly wbsNodeDisciplineReorderer = new WbsDisciplineReorderer();
  readonly wbsNodePhaseReorderer = new WbsNodePhaseReorderer();

  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}
}
