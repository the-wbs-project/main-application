import { RoutedBreadCrumbItem } from '@wbs/core/models';

export class MainContentSizeChanged {
  static readonly type = '[UI] Main Content Size Changed';
  constructor(readonly mainContentWidth: number) {}
}

export class ParseNavigation {
  static readonly type = '[UI] Parse Navigation';
  constructor(readonly path: string) {}
}

export class SetBreadcrumbs {
  static readonly type = '[UI] Set Breadcrumbs';
  constructor(readonly breadcrumbs: RoutedBreadCrumbItem[]) {}
}

export class ToggleSidebar {
  static readonly type = '[UI] Toggle Sidebar';
}
