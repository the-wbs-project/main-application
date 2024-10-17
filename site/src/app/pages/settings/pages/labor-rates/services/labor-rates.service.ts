import { Injectable, inject } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { User } from '@wbs/core/models';
import { IdService, Messages } from '@wbs/core/services';
import { MembershipStore, UserStore } from '@wbs/core/store';
import { InviteViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { LaborRatesStore } from './labor-rates.store';

@Injectable()
export class LaborRatesService {
  private readonly data = inject(DataServiceFactory);
  private readonly messages = inject(Messages);
  private readonly store = inject(LaborRatesStore);
  private readonly profile = inject(UserStore).profile;
}
