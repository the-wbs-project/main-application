import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LibraryCreateState } from '../states';

export const titleResolver: ResolveFn<string> = () =>
  inject(Store).selectSnapshot(LibraryCreateState.title);

export const typeResolver: ResolveFn<Observable<string | undefined>> = () =>
  inject(Store).selectOnce(LibraryCreateState.type);

export const categoryResolver: ResolveFn<Observable<string | undefined>> = () =>
  inject(Store).selectOnce(LibraryCreateState.category);

export const categoriesResolver: ResolveFn<
  Observable<string[] | undefined>
> = () => inject(Store).selectOnce(LibraryCreateState.categories);

export const categoriesPageDescriptionResolver: ResolveFn<
  Observable<string>
> = () =>
  inject(Store)
    .selectOnce(LibraryCreateState.type)
    .pipe(
      map((type) =>
        type === 'phase'
          ? 'LibraryCreate.Categories_Description_Phase'
          : 'LibraryCreate.Categories_Description_Task'
      )
    );
