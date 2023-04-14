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

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbCollapseModule,
    NgbDropdownModule,
    RouterModule.forChild([
      {
        path: '',
        component: ContentLayoutComponent,
        children: ROUTES,
      },
    ]),
    TranslateModule.forChild(),
  ],
  providers: [LayoutService, NavService, ScriptService],
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
