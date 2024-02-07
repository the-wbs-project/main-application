import { RoutedBreadcrumbItem } from '@wbs/core/models';

export class SetActiveSection {
  static readonly type = '[UI] Set Active Section';
  constructor(readonly activeSection: string) {}
}

export class SetActiveSubSection {
  static readonly type = '[UI] Set Active Sub-Section';
  constructor(readonly activeSubSection: string) {}
}

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
  constructor(readonly breadcrumbs: RoutedBreadcrumbItem[]) {}
}

export class ToggleSidebar {
  static readonly type = '[UI] Toggle Sidebar';
}
