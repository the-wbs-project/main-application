import { Injectable } from '@angular/core';

class LocalStorage {
  constructor(private readonly prefix: string) {}

  get(key: string): string | null {
    return localStorage.getItem(this.getKey(key));
  }

  set(key: string, value: string) {
    localStorage.setItem(this.getKey(key), value);
  }

  remove(key: string) {
    localStorage.removeItem(this.getKey(key));
  }

  private getKey(key: string): string {
    return `${this.prefix}-${key}`;
  }
}

class SessionStorage {
  constructor(private readonly prefix: string) {}

  get(key: string): string | null {
    return sessionStorage.getItem(this.getKey(key));
  }

  set(key: string, value: string) {
    sessionStorage.setItem(this.getKey(key), value);
  }

  remove(key: string) {
    sessionStorage.removeItem(this.getKey(key));
  }

  private getKey(key: string): string {
    return `${this.prefix}-${key}`;
  }
}

@Injectable({ providedIn: 'root' })
export class Storage {
  private readonly _local: LocalStorage;
  private readonly _session: SessionStorage;

  constructor() {
    this._local = new LocalStorage('WBS');
    this._session = new SessionStorage('WBS');
  }

  get local(): LocalStorage {
    return this._local;
  }

  get session(): SessionStorage {
    return this._session;
  }
}
