import { DbService } from './db.service';

export interface DbFactory {
  readonly projects: DbService;
}
