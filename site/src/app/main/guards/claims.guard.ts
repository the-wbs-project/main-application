import { inject } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ORGANIZATION_CLAIMS } from '@wbs/core/models';
import { map } from 'rxjs/operators';

const claimsGuard = (
  data: DataServiceFactory,
  org: string,
  claims: string | string[]
) => {
  //
  //  We need to wait for the membership state to load before we can check the roles.
  //
  console.log('test');
  return data.claims.getOrganizationClaimsAsync(org).pipe(
    map((userClaims) => {
      if (!userClaims) return false;

      if (typeof claims === 'string') return userClaims.includes(claims);

      for (const claim of claims) {
        if (userClaims.includes(claim)) return true;
      }
      return false;
    })
  );
};

export const settingsReadGuard = () => {
  //TODO FIX!!!
  return claimsGuard(inject(DataServiceFactory), 'acme_engineering', [
    ORGANIZATION_CLAIMS.SETTINGS.READ,
  ]);
};
