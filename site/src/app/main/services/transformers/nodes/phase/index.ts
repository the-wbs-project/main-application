import { Store } from '@ngxs/store';
import { Resources } from '../../../../../core/services/resource.service';
import { WbsNodePhaseProjectImporter } from './wbs-node-phase-project-importer.service';
import { WbsNodePhaseReorderer } from './wbs-node-phase-reorderer.service';
import { WbsNodePhaseTransformer } from './wbs-node-phase.service';
import { WbsNodeLibraryImporter } from './wbs-node-library-importer.service';

export class WbsPhaseNodeTransformers {
  readonly view = new WbsNodePhaseTransformer(this.resources, this.store);
  readonly reorderer = new WbsNodePhaseReorderer();
  readonly projectImporter = new WbsNodePhaseProjectImporter();
  readonly libraryImporter = new WbsNodeLibraryImporter();

  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}
}
