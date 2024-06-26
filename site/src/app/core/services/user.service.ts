import { Injectable } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Member, User } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { skipWhile, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly users = new Map<string, BehaviorSubject<User | undefined>>();

  constructor(private readonly data: DataServiceFactory) {}

  getUser(userId: string): Observable<User | undefined> {
    if (this.users.has(userId)) {
      return <Observable<User>>(
        this.users.get(userId)!.pipe(skipWhile((u) => u === undefined))
      );
    }
    this.users.set(userId, new BehaviorSubject<User | undefined>(undefined));

    return this.data.users
      .getAsync(userId)
      .pipe(tap((user) => this.users.get(userId)!.next(user)));
  }

  addUsers(users: User[] | User): void {
    for (const user of Array.isArray(users) ? users : [users]) {
      if (this.users.has(user.id)) continue;

      this.users.set(user.id, new BehaviorSubject<User | undefined>(user));
    }
  }

  getSortedUsers(allMembers: Member[], userIds: string[]): Member[] {
    return allMembers
      .filter((x) => userIds.includes(x.id))
      .sort((a, b) => sorter(a.name, b.name));
  }
}
