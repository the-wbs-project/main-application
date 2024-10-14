import { Injectable, Signal, computed, signal } from '@angular/core';
import { EntityId, UserProfile } from '@wbs/core/models';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly _profile = signal<UserProfile | undefined>(undefined);

  readonly watchers = new WatcherStore();

  get profile(): Signal<UserProfile | undefined> {
    return this._profile;
  }

  get displayName(): Signal<string | undefined> {
    return computed(() => this.profile()?.fullName);
  }

  get userId(): Signal<string | undefined> {
    return computed(() => this.profile()?.userId);
  }

  set(user: UserProfile | undefined): void {
    this._profile.set(user);

    //if (user) this.userService.addUsers(user);
  }
}

export class WatcherStore {
  readonly library = new WatcherByItemStore();
  readonly projects = new WatcherByItemStore();
}

export class WatcherByItemStore {
  private _items = signal<EntityId[] | undefined>(undefined);

  get items(): Signal<EntityId[] | undefined> {
    return this._items;
  }

  set(items: EntityId[]): void {
    this._items.set(items);
  }

  add(item: EntityId): void {
    this._items.update((list) => [...(list ?? []), item]);
  }

  remove(item: EntityId): void {
    this._items.update((list) => {
      if (!list) return list;

      let index = list.findIndex(
        (x) => x.id === item.id && x.ownerId === item.ownerId
      );

      if (index !== -1) list.splice(index, 1);

      return [...list];
    });
  }
}
