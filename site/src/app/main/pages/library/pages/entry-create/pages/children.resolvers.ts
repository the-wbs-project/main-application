import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryCreateState } from '../states';

export const titleResolver: ResolveFn<Observable<string>> = () =>
  inject(Store).selectOnce(LibraryCreateState.title);

export const descriptionResolver: ResolveFn<Observable<string>> = () =>
  inject(Store).selectOnce(LibraryCreateState.description);

export const typeResolver: ResolveFn<Observable<string | undefined>> = () =>
  inject(Store).selectOnce(LibraryCreateState.type);
