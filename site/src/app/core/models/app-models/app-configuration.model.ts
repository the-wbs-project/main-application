import { InjectionToken } from '@angular/core';
import { Category } from '../category.model';
import { Role } from '../role.model';

export interface AppConfiguration {
  api_domain: string;
  app_title: string;
  auth_clientId: string;
  can_test_ai: string[];
  disciplines: Category[];
  environment: string;
  phases: Category[];
  project_categories: Category[];
  resources: any;
  roles: Role[];
}

export const APP_CONFIG_TOKEN = new InjectionToken<AppConfiguration>(
  'AppConfiguration'
);
