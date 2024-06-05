import { Injectable, inject } from '@angular/core';
import {
  TranslateService,
  MissingTranslationHandlerParams,
  MissingTranslationHandler,
} from '@ngx-translate/core';
import { APP_CONFIG_TOKEN, AppConfiguration } from '../models';

declare type ResourceType = Record<string, Record<string, string>>;

@Injectable({ providedIn: 'root' })
export class Resources extends MissingTranslationHandler {
  private readonly appConfig: AppConfiguration = inject(APP_CONFIG_TOKEN);
  private readonly cache = new Map<string, string>();
  private readonly culture = 'en';
  private readonly redeemed: string[] = [];
  private resources: ResourceType = {};

  constructor(private readonly translate: TranslateService) {
    super();

    this.resources = this.appConfig.resources;
    this.translate.setTranslation(this.culture, this.resources);
    this.translate.setDefaultLang(this.culture);
    this.translate.missingTranslationHandler = this;
  }

  get(resource: string, defaultValue?: string): string {
    if (resource == null) return 'EMPTY';

    if (this.cache.has(resource)) return this.cache.get(resource)!;

    let value = this.getExact(resource);

    if (value) this.cache.set(resource, value);

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

      console.error('No resource found for ' + resource);

      return resource;
    } catch (e) {
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
}
