import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { AiModel } from '@wbs/core/models';
import { AiState } from '@wbs/main/states';
import { first, map, skipWhile } from 'rxjs/operators';

export const aiModelResolver: ResolveFn<AiModel[]> = () =>
  inject(Store)
    .select(AiState.models)
    .pipe(
      skipWhile((x) => x == undefined),
      map((x) => x!),
      first()
    );
