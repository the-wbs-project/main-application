import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, delay, of } from 'rxjs';

describe('Utils', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), RouterModule],
      providers: [],
    });
    store = TestBed.inject(Store);
  });

  it('getOwner - get from params', () => {
    spyOn(store, 'select').and.returnValue(of({ owner: 'fromStore' }));

    getOwner(store, { ownerId: 'fromParams' }).subscribe((result) => {
      expect(result).toEqual('fromParams');
    });
  });

  it('getOwner - get from store', () => {
    spyOn(store, 'select').and.returnValue(of({ owner: 'fromStore' }));

    getOwner(store, {}).subscribe((result) => {
      expect(result).toEqual('fromStore');
    });
  });

  it('getOwner - get from store with delay', fakeAsync(() => {
    const subj = new BehaviorSubject<any>(undefined);

    spyOn(store, 'select').and.returnValue(subj);

    let result: string | undefined;
    getOwner(store, {}).subscribe((x) => {
      result = x;
    });

    of({ owner: 'fromStore' })
      .pipe(delay(50000))
      .subscribe((obj) => subj.next(obj));

    tick(60000);
    console.log('past tick');
    expect(result).toEqual('fromStore');
  }));
});
