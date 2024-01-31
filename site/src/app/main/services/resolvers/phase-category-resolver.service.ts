import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { ListItem } from '@wbs/core/models';
import { MetadataState } from '@wbs/main/states';
import { first, skipWhile } from 'rxjs/operators';

export const phaseCategoryResolver: ResolveFn<ListItem[]> = () =>
  inject(Store)
    .select(MetadataState.phases)
    .pipe(
      skipWhile((x) => x == undefined),
      first()
    );
