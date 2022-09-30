import { EdgeDataService } from './edge-data.service';

export interface EdgeService {
  data: EdgeDataService;
  authData: EdgeDataService;

  getEdgeProperties(): Record<string, any> | undefined;

  waitUntil(func: Promise<unknown>): void;

  cacheMatch(): Promise<Response | null>;

  cachePut(response: Response): void;
}
