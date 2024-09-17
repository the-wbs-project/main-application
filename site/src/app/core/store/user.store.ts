import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { EntityId, User } from '@wbs/core/models';
import { UserService } from '@wbs/core/services';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly userService = inject(UserService);
  private readonly _profile = signal<User | undefined>(undefined);

  readonly watchers = new WatcherStore();

  get profile(): Signal<User | undefined> {
    return this._profile;
  }

  get displayName(): Signal<string | undefined> {
    return computed(() => this.profile()?.name);
  }

  get userId(): Signal<string | undefined> {
    return computed(() => this.profile()?.user_id);
  }

  set(user: User | undefined): void {
    this._profile.set(user);

    //if (user) this.userService.addUsers(user);
  }
}

export class WatcherStore {
  readonly library = new WatcherByItemStore();
  readonly projects = new WatcherByItemStore();
}

export class WatcherByItemStore {
  private _items = signal<EntityId[]>([]);

  get items(): Signal<EntityId[]> {
    return this._items;
  }

  set(items: EntityId[]): void {
    this._items.set(items);
  }

  add(item: EntityId): void {
    this._items.update((list) => [...list, item]);
  }

  remove(item: EntityId): void {
    this._items.update((list) => {
      let index = list.findIndex(
        (x) => x.id === item.id && x.ownerId === item.ownerId
      );

      if (index !== -1) list.splice(index, 1);

      return [...list];
    });
  }
}
