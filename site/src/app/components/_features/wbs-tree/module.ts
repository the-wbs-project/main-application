import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { IconsModule } from '@progress/kendo-angular-icons';
import { TooltipsModule } from '@progress/kendo-angular-tooltip';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { SharedModule } from '@wbs/shared/module';
import {
  DisciplineIconComponent,
  DisciplineIconListComponent,
  LegendDisciplineComponent,
  WbsLevelPopoverComponent,
  WbsTreeComponent,
} from './components';
import { WbsPhaseService } from './services';
import { WbsTreeToolbarDirective } from './directives';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { WbsNodeGeneralModule } from '../wbs-node-general';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

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
