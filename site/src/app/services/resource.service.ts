import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  TranslateService,
  MissingTranslationHandlerParams,
  MissingTranslationHandler,
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

type MissingResource = {
  key: string;
  culture: string;
  category: string;
  name: string;
};

@Injectable({ providedIn: 'root' })
export class Resources extends MissingTranslationHandler {
  private readonly culture = 'en';
  private readonly redeemed: string[] = [];
  private _timer$: Observable<void | null> | null = null;
  private resources: any[] = [];
  private _recordedMissing: string[] = [];
  private _missingQueue: MissingResource[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly translate: TranslateService
  ) {
    super();
  }

  setup(resource: any) {
    this.resources.push(resource);

    this.translate.setTranslation(this.culture, resource);
    this.translate.setDefaultLang(this.culture);
    this.translate.missingTranslationHandler = this;
  }

  append(resources: any | null | undefined) {
    if (resources) {
      this.translate.setTranslation(this.culture, resources, true);
      this.resources.push(resources);
    }
  }

  get(resource: string | string[], defaultValue?: string): string {
    if (resource == null) return 'EMPTY';

    let group: string | null = null;
    let name: string | null = null;

    if (typeof resource === 'string') {
      const index = resource.indexOf('.');
      group = resource.substring(0, index);
      name = resource.substring(index + 1, resource.length);
    } else if (Array.isArray(resource) && (<string[]>resource).length === 2) {
      group = resource[0];
      name = resource[1];
    } else {
      return 'INVALID';
    }

    try {
      for (const resource of this.resources) {
        if (resource != null) {
          const category = resource[group];
          const value = category == null ? null : category[name];

          if (value) return value;
        }
      }
      //
      //  Missing territory
      //
      let value: any;

      if (value == null) this.recordMissing(group, name);

      return value != null
        ? value
        : defaultValue != null
        ? defaultValue
        : `${group}.${name}`;
    } catch (e) {
      console.error(`Error trying to retrieve '${group}.${name}}' value.`);
      return defaultValue == null ? `${group}.${name}` : defaultValue;
    }
  }

  handle(params: MissingTranslationHandlerParams) {
    const key: any = params.key;

    if (typeof key === 'number') return key;
    if (typeof key === 'string') {
      if (this.redeemed.indexOf(key) > -1) return key;

      const parts = key.split('.');

      if (parts.length === 1) {
        console.log('Redeemed: ' + key);
        this.redeemed.push(key);
        return key;
      }

      this.recordMissing(parts[0], parts[1]);
    }
    return params.key;
  }

  private recordMissing(category: string, name: string): void {
    if (category == null || category.trim() === '') category = 'none';
    if (name == null || name.trim() === '') name = 'none';

    const path = `${category}.${name}`;
    const key = `${this.culture}-${path}`;

    if (
      this._recordedMissing.indexOf(key) > -1 ||
      this._missingQueue.find((r) => r.key === key)
    )
      return;

    try {
      this._missingQueue.push({
        key,
        category,
        name,
        culture: this.culture,
      });
    } catch (e) {
      console.log(e);
    }
  }

  private sendMissing(): Observable<void | null> {
    if (this._missingQueue.length === 0) return of(null);

    return this.http.put<void>('resources/missing', this._missingQueue).pipe(
      tap(() => {
        for (const item of this._missingQueue) {
          this._recordedMissing.push(item.key);
        }
        this._missingQueue = [];
      })
    );
  }
}
