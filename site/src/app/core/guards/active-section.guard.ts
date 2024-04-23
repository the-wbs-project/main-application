import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { SetActiveSection } from '../../main/actions';

export const librarySectionGuard = () =>
  inject(Store)
    .dispatch(new SetActiveSection('library'))
    .pipe(map(() => true));

export const projectsSectionGuard = () =>
  inject(Store)
    .dispatch(new SetActiveSection('projects'))
    .pipe(map(() => true));

export const settingsSectionGuard = () =>
  inject(Store)
    .dispatch(new SetActiveSection('settings'))
    .pipe(map(() => true));
