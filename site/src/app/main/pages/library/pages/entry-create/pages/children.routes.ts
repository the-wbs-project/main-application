import { Routes } from '@angular/router';
import { orgResolve, projectCategoryResolver } from '@wbs/main/services';
import {
  categoriesPageDescriptionResolver,
  categoriesResolver,
  redirectGuard,
  setupGuard,
  startWizardGuard,
  titleResolver,
  typeResolver,
  verifyWizardGuard,
} from '../services';

export const routes: Routes = [
  {
    path: '',
    canActivate: [redirectGuard],
    loadComponent: () => import('./basics').then((x) => x.BasicsComponent),
  },
  {
    path: 'getting-started',
    canActivate: [setupGuard, startWizardGuard],
    loadComponent: () =>
      import('./getting-started.component').then(
        (x) => x.GettingStartedComponent
      ),
    data: {
      pageTitle: 'LibraryCreate.GettingStarted_Title',
      pageDescription: 'LibraryCreate.GettingStarted_Description',
    },
    resolve: {
      org: orgResolve,
    },
  },
  {
    path: 'basics',
    canActivate: [setupGuard, verifyWizardGuard],
    loadComponent: () => import('./basics').then((x) => x.BasicsComponent),
    data: {
      pageTitle: 'LibraryCreate.Basics_Title',
      pageDescription: 'LibraryCreate.Basics_Description',
    },
    resolve: {
      org: orgResolve,
      title: titleResolver,
      type: typeResolver,
    },
  },
  {
    path: 'category',
    canActivate: [setupGuard, verifyWizardGuard],
    loadComponent: () => import('./category').then((x) => x.CategoryComponent),
    data: {
      pageTitle: 'LibraryCreate.Category_Title',
      pageDescription: 'LibraryCreate.Category_Description',
    },
    resolve: {
      org: orgResolve,
      type: typeResolver,
      categories: projectCategoryResolver,
      selected: categoriesResolver,
    },
  },
  {
    path: 'categories',
    canActivate: [setupGuard, verifyWizardGuard],
    loadComponent: () =>
      import('./categories').then((x) => x.CategoriesComponent),
    data: {
      pageTitle: 'LibraryCreate.Categories_Title',
    },
    resolve: {
      org: orgResolve,
      pageDescription: categoriesPageDescriptionResolver,
      categories: projectCategoryResolver,
    },
  } /*
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
