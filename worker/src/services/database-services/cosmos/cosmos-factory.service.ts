import { DbService } from '..';
import { Config } from '../../../config';
import { Logger } from '../../logger.service';
import { DbFactory } from '../db-factory.service';
import { CosmosDbService } from './cosmos-db.service';

export class CosmosFactory implements DbFactory {
  constructor(private readonly config: Config, private readonly logger: Logger) {}

  createDbService(
    mainRequest: Request,
    config: {
      dbId: string;
      collId: string;
      pkVariable: string;
    },
  ): DbService {
    return new CosmosDbService(config.dbId, config.collId, this.config, this.logger, mainRequest, config.pkVariable);
  }
}
