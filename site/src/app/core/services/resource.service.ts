import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  TranslateService,
  MissingTranslationHandlerParams,
  MissingTranslationHandler,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from './logger.service';

declare type ResourceType = Record<string, Record<string, string>>;

@Injectable({ providedIn: 'root' })
export class Resources extends MissingTranslationHandler {
  private readonly culture = 'en';
  private readonly redeemed: string[] = [];
  private resources: ResourceType = {};

  constructor(
    private readonly http: HttpClient,
    private readonly logger: Logger,
    private readonly translate: TranslateService
  ) {
    super();
  }

  initiate(): Observable<void> {
    return this.getFromServerAsync().pipe(
      map((resources) => {
        this.resources = resources;
        this.translate.setTranslation(this.culture, resources);
        this.translate.setDefaultLang(this.culture);
        this.translate.missingTranslationHandler = this;
      })
    );
  }

  get(resource: string, defaultValue?: string): string {
    if (resource == null) return 'EMPTY';

    let value = this.getExact(resource);

    return value != null
      ? value
      : defaultValue != null
      ? defaultValue
      : resource;
  }

  getExact(resource: string): string {
    if (resource == null) return 'EMPTY';
    if (resource.indexOf('.') === -1) return resource;

    const parts = resource.split('.');

    try {
      const result = this.resources[parts[0]][parts[1]];

      if (result) return result;

      this.logger.error('No resource found for ' + resource);

      return resource;
    } catch (e) {
      console.log(e);
      console.error(`Error trying to retrieve '${resource}' value.`);
      return 'Error';
    }
  }

  handle(params: MissingTranslationHandlerParams) {
    const key: any = params.key;

    if (typeof key === 'number') return key;
    if (typeof key === 'string') {
      if (this.redeemed.indexOf(key) > -1) return key;
    }
    return params.key;
  }

  private getFromServerAsync(): Observable<ResourceType> {
    return this.http
      .get<ResourceType>('api/resources/all/en-US')
      .pipe(map((x) => x ?? {}));
  }
}
