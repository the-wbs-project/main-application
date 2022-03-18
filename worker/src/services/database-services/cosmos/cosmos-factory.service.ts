import { DbService } from '..';
import { Config } from '../../../config';
import { Logger } from '../../logger.service';
import { DbFactory } from '../db-factory.service';
import { CosmosDbService } from './cosmos-db.service';

export class CosmosFactory implements DbFactory {
  readonly metadata: DbService;
  readonly projects: DbService;

  constructor(config: Config, logger: Logger) {
    this.metadata = new CosmosDbService(config, 'Metadata', logger);
    this.projects = new CosmosDbService(config, 'Projects', logger);
  }
}
