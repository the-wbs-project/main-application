import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import {
  orgResolve,
  phaseCategoryResolver,
  projectCategoryResolver,
} from '@wbs/main/services';
import {
  LibraryEntryCreateService,
  categoriesPageDescriptionResolver,
  redirectGuard,
  setupGuard,
  startWizardGuard,
  typeResolver,
  verifyWizardGuard,
} from './services';
import { LibraryCreateState } from './states';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./library-create.component').then(
        (x) => x.LibraryCreateComponent
      ),
    providers: [
      importProvidersFrom(NgxsModule.forFeature([LibraryCreateState])),
      LibraryEntryCreateService,
    ],
    children: [
      {
        path: '',
        canActivate: [redirectGuard],
        loadComponent: () =>
          import('./pages/basics').then((x) => x.BasicsComponent),
      },
      {
        path: 'getting-started',
        canActivate: [setupGuard, startWizardGuard],
        loadComponent: () =>
          import('./pages/getting-started.component').then(
            (x) => x.GettingStartedComponent
          ),
        data: {
          pageTitle: 'LibraryCreate.GettingStarted_Title',
          pageDescription: 'LibraryCreate.GettingStarted_Description',
        },
        resolve: { org: orgResolve },
      },
      {
        path: 'basics',
        canActivate: [setupGuard, verifyWizardGuard],
        loadComponent: () =>
          import('./pages/basics').then((x) => x.BasicsComponent),
        data: {
          pageTitle: 'LibraryCreate.Basics_Title',
          pageDescription: 'LibraryCreate.Basics_Description',
        },
        resolve: { org: orgResolve },
      },
      {
        path: 'categories',
        canActivate: [setupGuard, verifyWizardGuard],
        loadComponent: () =>
          import('./pages/categories').then((x) => x.CategoriesComponent),
        data: {
          pageTitle: 'LibraryCreate.Categories_Title',
        },
        resolve: {
          org: orgResolve,
          type: typeResolver,
          pageDescription: categoriesPageDescriptionResolver,
          categories: projectCategoryResolver,
        },
      },
      {
        path: 'phases',
        canActivate: [setupGuard, verifyWizardGuard],
        loadComponent: () =>
          import('./pages/phases').then((x) => x.PhaseComponent),
        data: {
          title: 'LibraryCreate.Phases_Title',
          description: 'LibraryCreate.Phases_Description',
        },
        resolve: {
          org: orgResolve,
          categories: phaseCategoryResolver,
        },
      } /*
      {
        path: 'disciplines',
        canActivate: [setupGuard, verifyWizardGuard],
        loadComponent: () =>
          import('./disciplines/disciplines.component').then(
            (x) => x.DisciplinesComponent
          ),
        data: {
          title: 'ProjectCreate.Disciplines_Title',
          description: 'ProjectCreate.Disciplines_Description',
        },
        resolve: {
          org: orgResolve,
        },
      },
      {
        path: 'roles',
        canActivate: [setupGuard, verifyWizardGuard],
        loadComponent: () =>
          import('./roles/roles.component').then((x) => x.RolesComponent),
        data: {
          title: 'ProjectCreate.Roles_Title',
          description: 'ProjectCreate.Roles_Description',
        },
        resolve: {
          org: orgResolve,
        },
      },
      {
        path: LIBRARY_ENTRY_CREATION_PAGES.SAVING,
        canActivate: [setupGuard, verifyWizardGuard],
        loadComponent: () =>
          import('./saving.component').then((x) => x.SavingComponent),
        data: {
          title: 'ProjectCreate.Saving_Title',
          description: 'ProjectCreate.Saving_Description',
        },
        resolve: {
          org: orgResolve,
        },
      },*/,
    ],
  },
];
