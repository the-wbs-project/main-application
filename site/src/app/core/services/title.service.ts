import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Resources } from './resource.service';

@Injectable({ providedIn: 'root' })
export class TitleService {
  private readonly _title$ = new BehaviorSubject<string | null>(null);
  private readonly _subTitle$ = new BehaviorSubject<string | null>(null);

  constructor(
    private readonly title: Title,
    private readonly resources: Resources
  ) {}

  get title$(): Observable<string | null> {
    return this._title$;
  }

  get subTitle$(): Observable<string | null> {
    return this._subTitle$;
  }

  setTitle(title: string, isResource: boolean) {
    if (isResource) {
      this.titleText(this.resources.get(title));
    } else {
      this.titleText(title);
    }
  }

  setSubTitle(subTitle: string, isResource: boolean) {
    if (isResource) {
      this._subTitle$.next(this.resources.get(subTitle));
    } else {
      this._subTitle$.next(subTitle);
    }
  }

  private titleText(text: string) {
    const title = `${environment.appTitle} - ${text}`;
    this.title.setTitle(title);
    this._title$.next(title);
  }
}
