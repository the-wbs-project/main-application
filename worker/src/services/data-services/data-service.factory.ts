import { AuthDataService } from './auth.data-service';

export interface DataServiceFactory {
  get auth(): AuthDataService;
}
