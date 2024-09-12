import { Injectable } from '@angular/core';
import { MembershipStore, MetadataStore } from '@wbs/core/store';
import { WbsNodeService } from '../wbs-node.service';
import { ActivityTransformer } from './activity.transformer';
import { WbsNodeTransformers } from './nodes';
import { LibraryVersionTransformer } from './library-version.transformer';
import { ProjectTransformer } from './project.transformer';
import { ProjectTaskTransformer } from './project-node.transformer';

@Injectable({ providedIn: 'root' })
export class Transformers {
  readonly nodes = new WbsNodeTransformers(
    this.membership,
    this.metadata,
    this.wbsService
  );
  readonly activities = ActivityTransformer;
  readonly libraryVersions = LibraryVersionTransformer;
  readonly projects = ProjectTransformer;
  readonly projectTasks = ProjectTaskTransformer;

  constructor(
    private readonly membership: MembershipStore,
    private readonly metadata: MetadataStore,
    private readonly wbsService: WbsNodeService
  ) {}
}
