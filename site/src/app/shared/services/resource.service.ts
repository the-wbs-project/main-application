import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  TranslateService,
  MissingTranslationHandlerParams,
  MissingTranslationHandler,
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ResourceSections } from '@wbs/shared/models';

type MissingResource = {
  key: string;
  culture: string;
  path: string;
};

@Injectable({ providedIn: 'root' })
export class Resources extends MissingTranslationHandler {
  private readonly culture = 'en';
  private readonly pulled: string[] = [];
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

  verifyAsync(key: string): Observable<any> {
    if (this.pulled.indexOf(key) > -1) return of('nothing');

    return this.http
      .get<ResourceSections>(`resources/${key}`)
      .pipe(map((resources) => this.append(key, resources)));
  }

  get(resource: string, defaultValue?: string): string {
    if (resource == null) return 'EMPTY';

    const parts = resource.split('.');

    try {
      for (const resource of this.resources) {
        if (resource != null) {
          let x = resource;
          if (x)
            for (const part of parts) {
              x = x[part];

              if (!x) break;
            }
          if (x) return x;
        }
      }
      //
      //  Missing territory
      //
      let value: any;

      if (value == null) this.recordMissing(resource);

      return value != null
        ? value
        : defaultValue != null
        ? defaultValue
        : resource;
    } catch (e) {
      console.log(e);
      console.error(`Error trying to retrieve '${resource}' value.`);
      return defaultValue == null ? resource : defaultValue;
    }
  }

  handle(params: MissingTranslationHandlerParams) {
    const key: any = params.key;

    if (typeof key === 'number') return key;
    if (typeof key === 'string') {
      if (this.redeemed.indexOf(key) > -1) return key;

      this.recordMissing(key);
    }
    return params.key;
  }

  private append(key: string, resources: ResourceSections | null | undefined) {
    if (resources) {
      this.translate.setTranslation(this.culture, resources, true);
      this.resources.push(resources);
      this.pulled.push(key);
    }
  }

  private recordMissing(path: string): void {
    const key = `${this.culture}-${path}`;

    if (
      this._recordedMissing.indexOf(key) > -1 ||
      this._missingQueue.find((r) => r.key === key)
    )
      return;

    try {
      this._missingQueue.push({
        key,
        path,
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
