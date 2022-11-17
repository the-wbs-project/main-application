import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  NgbCollapseModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ROUTES } from '@wbs/routes';
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
} from 'ngx-perfect-scrollbar';
import {
  ContentLayoutComponent,
  FooterComponent,
  HeaderComponent,
  SidebarComponent,
  TabToTopComponent,
} from './components';
import {
  FullscreenDirective,
  MainContentDirective,
  SidemenuToggleDirective,
  ToggleThemeDirective,
} from './directives';
import { LayoutRoleListPipe, ProjectStatusCountPipe } from './pipes';
import { LayoutService, NavService, ScriptService } from './services';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbCollapseModule,
    NgbDropdownModule,
    PerfectScrollbarModule,
    RouterModule.forChild([
      {
        path: '',
        component: ContentLayoutComponent,
        children: ROUTES,
      },
    ]),
    TranslateModule.forChild(),
  ],
  providers: [
    LayoutService,
    NavService,
    ScriptService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  declarations: [
    ContentLayoutComponent,
    FooterComponent,
    FullscreenDirective,
    HeaderComponent,
    LayoutRoleListPipe,
    MainContentDirective,
    ProjectStatusCountPipe,
    SidebarComponent,
    SidemenuToggleDirective,
    TabToTopComponent,
    ToggleThemeDirective,
  ],
  exports: [ContentLayoutComponent, HeaderComponent],
})
export class LayoutModule {}
