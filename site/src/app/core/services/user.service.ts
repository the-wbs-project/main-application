import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DataServiceFactory } from '@wbs/core/data-services';
import { sorter } from '@wbs/core/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { skipWhile, tap } from 'rxjs/operators';
import { UserViewModel } from '../view-models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly users = new Map<
    string,
    BehaviorSubject<UserViewModel | undefined>
  >();

  constructor(private readonly data: DataServiceFactory) {}

  getUser(
    organization: string,
    userId: string
  ): Signal<UserViewModel | undefined> {
    return toSignal(this.getUserAsync(organization, userId));
  }

  getUserAsync(
    organization: string,
    userId: string
  ): Observable<UserViewModel | undefined> {
    const key = `${organization}:${userId}`;

    if (this.users.has(key)) {
      return <Observable<UserViewModel>>(
        this.users.get(key)!.pipe(skipWhile((u) => u === undefined))
      );
    }
    this.users.set(
      key,
      new BehaviorSubject<UserViewModel | undefined>(undefined)
    );

    return this.data.users
      .getAsync(organization, userId)
      .pipe(tap((user) => this.users.get(key)!.next(user)));
  }
}
