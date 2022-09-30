import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { IconsModule } from '@progress/kendo-angular-icons';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { TooltipsModule } from '@progress/kendo-angular-tooltip';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { SharedModule } from '@wbs/shared/module';
import { WbsNodeGeneralModule } from '../wbs-node-general';
import {
  DisciplineIconComponent,
  DisciplineIconListComponent,
  LegendDisciplineComponent,
  WbsLevelPopoverComponent,
  WbsTreeComponent,
} from './components';
import { WbsTreeToolbarDirective } from './directives';
import { WbsPhaseService } from './services';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    ContextMenuModule,
    IconsModule,
    NgbPopoverModule,
    RouterModule,
    SharedModule,
    TooltipsModule,
    TreeListModule,
    WbsNodeGeneralModule,
  ],
  providers: [WbsPhaseService],
  declarations: [
    DisciplineIconComponent,
    DisciplineIconListComponent,
    LegendDisciplineComponent,
    WbsLevelPopoverComponent,
    WbsTreeComponent,
    WbsTreeToolbarDirective,
  ],
  exports: [WbsTreeComponent, WbsTreeToolbarDirective],
})
export class WbsTreeModule {}
