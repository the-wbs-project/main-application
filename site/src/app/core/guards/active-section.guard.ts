import { inject } from '@angular/core';
import { UiStore } from '@wbs/store';

export const librarySectionGuard = () =>
  inject(UiStore).setActiveSection('library');

export const projectsSectionGuard = () =>
  inject(UiStore).setActiveSection('projects');

export const settingsSectionGuard = () =>
  inject(UiStore).setActiveSection('settings');
