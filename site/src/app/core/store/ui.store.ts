import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterDataResolved } from '@ngxs/router-plugin';
import { Actions, ofActionSuccessful } from '@ngxs/store';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UiStore {
  private readonly actions$ = inject(Actions);
  private readonly _activeSection = signal<string | undefined>(undefined);
  private readonly _mainContentWidth = signal<number | undefined>(undefined);
  private readonly _path = toSignal(
    this.actions$.pipe(
      ofActionSuccessful(RouterDataResolved<any>),
      map((action) => action.routerState.url)
    )
  );

  get activeSection(): Signal<string | undefined> {
    return this._activeSection;
  }

  get mainContentWidth(): Signal<number | undefined> {
    return this._mainContentWidth;
  }

  get path(): Signal<string | undefined> {
    return this._path;
  }

  get size(): Signal<'xs' | 'sm' | 'md' | 'lg' | 'xl'> {
    return computed(() => {
      const width = this.mainContentWidth();

      if (width! < 576) return 'xs';
      if (width! < 768) return 'sm';
      if (width! < 992) return 'md';
      if (width! < 1200) return 'lg';
      return 'xl';
    });
  }

  setActiveSection(section: string | undefined): void {
    this._activeSection.set(section);
  }

  setMainContentWidth(width: number | undefined): void {
    this._mainContentWidth.set(width);
  }

  setup(): void {}
}
