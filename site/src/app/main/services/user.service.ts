import { Injectable } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { UserLite } from '@wbs/core/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { skipWhile, tap } from 'rxjs/operators';

@Injectable()
export class UserService {
  private readonly users = new Map<
    string,
    BehaviorSubject<UserLite | undefined>
  >();

  constructor(private readonly data: DataServiceFactory) {}

  getUser(userId: string): Observable<UserLite> {
    if (this.users.has(userId)) {
      return <Observable<UserLite>>(
        this.users.get(userId)!.pipe(skipWhile((u) => u === undefined))
      );
    }
    this.users.set(
      userId,
      new BehaviorSubject<UserLite | undefined>(undefined)
    );

    return this.data.users
      .getAsync(userId)
      .pipe(tap((user) => this.users.get(userId)!.next(user)));
  }

  addUsers(users: UserLite[]): void {
    for (const user of users) {
      if (this.users.has(user.id)) continue;

      this.users.set(user.id, new BehaviorSubject<UserLite | undefined>(user));
    }
  }
}
