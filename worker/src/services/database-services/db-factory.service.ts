import { DbService } from './db.service';

export interface DbFactory {
  createDbService(
    mainRequest: Request,
    dbId: string,
    collId: string,
    pkVariable: string,
  ): DbService;
}
