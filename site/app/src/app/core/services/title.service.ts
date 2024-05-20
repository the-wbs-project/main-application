import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Resources } from './resource.service';

@Injectable({ providedIn: 'root' })
export class TitleService {
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
    const title = [environment.appTitle, ...texts].join(' - ');
    this.title.setTitle(title);
    this._title$.next(title);
  }
}
