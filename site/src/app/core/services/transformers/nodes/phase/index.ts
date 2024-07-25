import { CategoryService } from '@wbs/core/services';
import { MembershipStore, MetadataStore } from '@wbs/core/store';
import { WbsNodePhaseProjectImporter } from './wbs-node-phase-project-importer.service';
import { WbsNodePhaseReorderer } from './wbs-node-phase-reorderer.service';
import { WbsNodePhaseTransformer } from './wbs-node-phase.service';
import { WbsNodeLibraryImporter } from './wbs-node-library-importer.service';

export class WbsPhaseNodeTransformers {
  readonly view = new WbsNodePhaseTransformer(
    this.categoryService,
    this.membership,
    this.metadata
  );
  readonly reorderer = new WbsNodePhaseReorderer();
  readonly projectImporter = new WbsNodePhaseProjectImporter();
  readonly libraryImporter = new WbsNodeLibraryImporter();

  constructor(
    private readonly categoryService: CategoryService,
    private readonly membership: MembershipStore,
    private readonly metadata: MetadataStore
  ) {}
}
