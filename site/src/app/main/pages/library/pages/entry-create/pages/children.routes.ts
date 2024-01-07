import { Routes } from '@angular/router';
import { orgResolve } from '@wbs/main/services';
import {
  redirectGuard,
  setupGuard,
  startWizardGuard,
  verifyWizardGuard,
} from './children.guards';
import { descriptionResolver, titleResolver } from './children.resolvers';

export const routes: Routes = [
  {
    path: '',
    canActivate: [redirectGuard],
    loadComponent: () =>
      import('./getting-started/getting-started.component').then(
        (x) => x.GettingStartedComponent
      ),
  },
  {
    path: 'getting-started',
    canActivate: [setupGuard, startWizardGuard],
    loadComponent: () =>
      import('./getting-started/getting-started.component').then(
        (x) => x.GettingStartedComponent
      ),
    data: {
      pageTitle: 'LibraryCreate.GettingStarted_Title',
      pageDescription: 'LibraryCreate.GettingStarted_Description',
    },
    resolve: {
      org: orgResolve,
      title: titleResolver,
      description: descriptionResolver,
    },
  } /*
  {
    path: 'category',
    canActivate: [setupGuard, verifyWizardGuard],
    loadComponent: () =>
      import('./categories/categories.component').then(
        (x) => x.CategoriesComponent
      ),
    data: {
      title: 'ProjectCreate.Category_Title',
      description: 'ProjectCreate.Category_Description',
    },
    resolve: {
      org: orgResolve,
      categories: projectCategoryResolver,
    },
  },
  {
    path: 'phases',
    canActivate: [setupGuard, verifyWizardGuard],
    loadComponent: () =>
      import('./phases/phases.component').then((x) => x.PhaseComponent),
    data: {
      title: 'ProjectCreate.Phases_Title',
      description: 'ProjectCreate.Phases_Description',
    },
    resolve: {
      org: orgResolve,
    },
  },
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
];
