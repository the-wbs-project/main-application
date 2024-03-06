import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { SetActiveSubSection } from '../actions';

export const aboutSubSectionGuard = () =>
  inject(Store)
    .dispatch(new SetActiveSubSection('about'))
    .pipe(map(() => true));

export const tasksSubSectionGuard = () =>
  inject(Store)
    .dispatch(new SetActiveSubSection('tasks'))
    .pipe(map(() => true));

export const resourcesSubSectionGuard = () =>
  inject(Store)
    .dispatch(new SetActiveSubSection('resources'))
    .pipe(map(() => true));

export const settingsSubSectionGuard = () =>
  inject(Store)
    .dispatch(new SetActiveSubSection('settings'))
    .pipe(map(() => true));
