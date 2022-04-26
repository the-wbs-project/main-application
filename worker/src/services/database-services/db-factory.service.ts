import { DbService } from './db.service';

export interface DbFactory {
  readonly activities: DbService;
  readonly projects: DbService;
  readonly projectNodes: DbService;
  readonly metadata: DbService;
}
