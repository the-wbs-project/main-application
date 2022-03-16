import { AuthDataService } from './auth.data-service';

export interface DataServiceFactory {
  auth: AuthDataService;
}
