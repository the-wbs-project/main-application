import { DbService } from '..';
import { Config } from '../../../config';
import { Logger } from '../../logger.service';
import { DbFactory } from '../db-factory.service';
import { CosmosDbService } from './cosmos-db.service';

export class CosmosFactory implements DbFactory {
  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
  ) {}

  createDbService(dbId: string, collId: string, pkVariable = 'pk'): DbService {
    return new CosmosDbService(
      dbId,
      collId,
      this.config,
      this.logger,
      pkVariable,
    );
  }
}
