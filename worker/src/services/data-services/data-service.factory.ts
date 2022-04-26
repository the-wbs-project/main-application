import { DbFactory } from '../database-services';
import { EdgeService } from '../edge-services';
import { InitialDataService } from './initial.data-service';
import { ProjectDataService } from './project.data-service';
import { MetadataDataService } from './metadata.data-service';
import { ProjectNodeDataService } from './project-node.data-service';

export class DataServiceFactory {
  readonly metadata = new MetadataDataService(
    this.dbFactory.metadata,
    this.edge.data,
  );
  readonly projects = new ProjectDataService(
    this.dbFactory.projects,
    this.edge.data,
  );
  readonly projectNodes = new ProjectNodeDataService(
    this.dbFactory.projectNodes,
    this.edge.data,
  );
  readonly initial = new InitialDataService(this.metadata, this.projects);

  constructor(
    private readonly dbFactory: DbFactory,
    private readonly edge: EdgeService,
  ) {}
}
