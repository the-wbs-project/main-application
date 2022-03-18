import { DbService } from './db.service';

export interface DbFactory {
  readonly projects: DbService;
  readonly metadata: DbService;
}
