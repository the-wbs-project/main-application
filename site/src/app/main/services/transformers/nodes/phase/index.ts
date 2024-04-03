import { Resources } from '@wbs/core/services';
import { CategoryState } from '@wbs/main/services';
import { WbsNodePhaseProjectImporter } from './wbs-node-phase-project-importer.service';
import { WbsNodePhaseReorderer } from './wbs-node-phase-reorderer.service';
import { WbsNodePhaseTransformer } from './wbs-node-phase.service';
import { WbsNodeLibraryImporter } from './wbs-node-library-importer.service';

export class WbsPhaseNodeTransformers {
  readonly view = new WbsNodePhaseTransformer(
    this.categoryState,
    this.resources
  );
  readonly reorderer = new WbsNodePhaseReorderer();
  readonly projectImporter = new WbsNodePhaseProjectImporter();
  readonly libraryImporter = new WbsNodeLibraryImporter();

  constructor(
    private readonly categoryState: CategoryState,
    private readonly resources: Resources
  ) {}
}
