import { DbService } from './db.service';

export interface DbFactory {
  createDbService(dbId: string, collId: string, pkVariable: string): DbService;
}
