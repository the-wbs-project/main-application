import { AuthCosmosDataService } from './auth.data-service';
import { AuthDataService, DataServiceFactory } from '../data-services';

export class CosmosDataServiceFactory implements DataServiceFactory {
  private readonly _auth: AuthCosmosDataService;

  public constructor() {
    this._auth = new AuthCosmosDataService();
  }

  get auth(): AuthDataService {
    return this._auth;
  }
}
