import { DbService } from './db.service';

export interface DbFactory {
  createDbService(
    mainRequest: Request,
    config: {
      dbId: string;
      collId: string;
      pkVariable: string;
    },
  ): DbService;
}
