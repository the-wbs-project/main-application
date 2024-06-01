import { TestBed, async } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { inject } from '@angular/core';

/*
describe('Utils', () => {
  let store: Store;
  let route: ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [Store],
    });
    store = TestBed.inject(Store);
    route = TestBed.inject(ActivatedRouteSnapshot);
  });

  it('should return the owner param if it exists', () => {
    const test = MembershipState.organization;

    spyOn(store, 'selectSnapshot').and.returnValue({ name: 'owner' });

    const result = Utils.getOrgName(store, route);

    expect(result).toEqual('owner');
  });

  it('should return the name from the store if neither the org nor owner param exists', () => {
    (store.selectSnapshot as jest.Mock).mockReturnValueOnce({
      name: 'org name',
    });

    const result = Utils.getOrgName(
      store as Store,
      route as ActivatedRouteSnapshot
    );

    expect(result).toBe('org name');
  });

  it('should return an empty string if the store does not have a name', () => {
    (store.selectSnapshot as jest.Mock).mockReturnValueOnce(undefined);

    const result = Utils.getOrgName(
      store as Store,
      route as ActivatedRouteSnapshot
    );

    expect(result).toBe('');
  });
});
*/
