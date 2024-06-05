import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { APP_CONFIG_TOKEN, AppConfiguration } from '../models';
import { Resources } from './resource.service';

@Injectable({ providedIn: 'root' })
export class TitleService {
  readonly appConfig: AppConfiguration = inject(APP_CONFIG_TOKEN);
  private readonly _title$ = new BehaviorSubject<string | null>(null);

  constructor(
    private readonly title: Title,
    private readonly resources: Resources
  ) {}

  get title$(): Observable<string | null> {
    return this._title$;
  }

  setTitle(parts: (string | { text: string })[]) {
    for (let i = 0; i < parts.length; i++) {
      const piece = parts[i];

      if (typeof piece !== 'string') {
        parts[i] = this.resources.get(piece.text);
      }
    }
    this.titleText(<string[]>parts);
  }

  private titleText(texts: string[]) {
    const title = [this.appConfig.app_title, ...texts].join(' - ');
    this.title.setTitle(title);
    this._title$.next(title);
  }
}
