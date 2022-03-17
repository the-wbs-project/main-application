import { DbService } from '..';
import { Config } from '../../../config';
import { Logger } from '../../logger.service';
import { DbFactory } from '../db-factory.service';
import { CosmosDbService } from './cosmos-db.service';

export class CosmosFactory implements DbFactory {
  readonly projects: DbService;

  constructor(config: Config, logger: Logger, mainRequest: Request) {
    this.projects = new CosmosDbService(
      config,
      'Projects',
      logger,
      mainRequest,
    );
  }
}
