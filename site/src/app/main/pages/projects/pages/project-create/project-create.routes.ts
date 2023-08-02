import { importProvidersFrom, inject } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { ProjectCreateState } from './states';
import { StartWizard } from './actions';

export const startCreationGuard = () => {
  return inject(Store).dispatch(new StartWizard()).pipe(map(() => true));
}


export const routes: Routes = [
  {
    path: '',
    canActivate: [startCreationGuard],
    loadComponent: () =>
      import('./project-create.component').then(({ ProjectCreateComponent }) => ProjectCreateComponent),
    providers: [
      importProvidersFrom(
        NgxsModule.forFeature([
          ProjectCreateState
        ])
      ),
    ]
  },
];